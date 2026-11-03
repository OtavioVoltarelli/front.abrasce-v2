# Subir uma versão nova em produção

Passo a passo para publicar uma versão nova do **backend** e/ou do **frontend** em `abrascesocial.org.br`.

> Este arquivo existe **idêntico** nos dois repositórios (`abrasce-v2` e `front.abrasce-v2`). Mudou num, copie para o outro.
> A instalação do servidor do zero, o backup e o restore completo estão no `DEPLOY.md` do backend.

## Como a produção funciona

| | Backend | Frontend |
|---|---|---|
| Onde é feito o build | **Na VPS** (`docker compose up -d --build app`) | **No Mac** (`npm run build`) |
| Como chega lá | `git push` no Mac, e depois `git pull` na VPS | `rsync` da pasta `dist/` para a VPS |
| Onde fica na VPS | `/opt/abrasce` (clone do repositório) | `/opt/abrasce/frontend/dist/` (fora do Git) |
| Reinicia algo? | Só o container `app`: alguns segundos fora do ar | Nada. O Caddy entrega os arquivos novos na hora |
| Como saber o que está no ar | `git -C /opt/abrasce log --oneline -1` | `https://abrascesocial.org.br/versao.txt` |

Acesso: `ssh abrasce@82.25.66.239`. Não existe CI/CD: tudo é manual. O workflow do GitHub no front publica **só a demo** do GitHub Pages, nunca a produção.

**Horário:** evite das 02:00 às 02:30 (o backup está rodando) e as 04:00 (reinício automático do Ubuntu, quando houver atualização).

---

## 1. Antes de começar (no Mac)

### 1.1 Os dois repositórios prontos

```bash
# backend
cd ~/projects/abrasce-v2
git checkout main && git pull
git status                         # limpo: nada para commitar
./mvnw test                        # o contextLoads precisa do Postgres local no ar
git push                           # a VPS clona do GitHub: o que não foi enviado não chega lá

# frontend
cd ~/projects/front.abrasce-v2/front.abrasce-v2
git checkout main && git pull
git status                         # limpo
npm run lint
git push
```

### 1.2 Ver o que muda em relação ao que está no ar

```bash
ssh abrasce@82.25.66.239 'git -C /opt/abrasce log --oneline -1'   # commit do backend em produção
cd ~/projects/abrasce-v2
git log --oneline <commit-em-producao>..main                          # o que vai subir
git diff --stat <commit-em-producao>..main -- src/main/resources/db/migration docker-compose.yml Caddyfile Dockerfile .env.example
```

Se a última linha mostrar alguma coisa, leia a **seção 5 (casos especiais)** antes de seguir.

### 1.3 Decidir a ordem

| Tipo de mudança | Ordem |
|---|---|
| Só backend, ou só frontend | Só a parte que mudou |
| Contrato da API **aditivo** (campo novo opcional, rota nova) | **Backend primeiro**, depois o frontend. O front antigo continua funcionando com o backend novo |
| Contrato **quebrado** (campo renomeado ou removido, rota apagada) | Backend e, **logo em seguida**, o frontend, num horário de pouco acesso. Entre os dois passos, o site pode mostrar erro |

O caso do contrato quebrado se evita fazendo a mudança em duas versões: primeiro o backend aceita o formato antigo **e** o novo, depois o front passa a usar o novo, e por fim o backend remove o antigo. Esse padrão se chama *expand and contract* (ou *parallel change*).

---

## 2. Backend

Na VPS:

```bash
ssh abrasce@82.25.66.239
cd /opt/abrasce
git status                                     # limpo. .env, data/, backups/ e frontend/dist/ não aparecem (estão no .gitignore)
git log --oneline -1                           # ANOTE o commit: é o ponto de volta
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" abrascesocial' | gzip > ~/pre-deploy-$(date +%F-%H%M).sql.gz
gunzip -t ~/pre-deploy-*.sql.gz && echo "dump OK"
git pull
docker compose up -d --build app
docker compose logs -f app                     # espere o "Started AbrasceV2Application"; saia com Ctrl+C
```

- O `pg_dump` antes do `pull` é o seu seguro: se a versão nova tiver uma migration que estrague algo, é ele que traz o banco de volta. O backup das 02:00 pode ter até 24 horas de atraso.
- O `--build` compila **enquanto a versão antiga continua no ar**. Só depois que a imagem fica pronta o container é trocado. Se o build falhar, nada muda e o site segue na versão anterior.
- O Flyway aplica as migrations novas sozinho, no start. No log, procure por `Successfully applied N migration`. Se o start falhar, o log diz o motivo: variável faltando (`ProdConfigCheck`), migration com erro ou schema divergente (`validate`).

Conferência rápida:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://abrascesocial.org.br/api/news   # 200
docker compose ps                                                                 # app "Up", sem reinícios
```

Depois, a **conferência completa** da seção 4.

### Limpeza (alguns dias depois)

```bash
docker image prune -f                                                # imagens antigas do app: cada build deixa uma de algumas centenas de MB
find ~ -maxdepth 1 -name 'pre-deploy-*.sql.gz' -mtime +7 -delete    # o dump tem CPF: não deixe sobrando
```

---

## 3. Frontend

No Mac, no repositório do front. **Sempre faça o build na `main`, logo antes do rsync.** Nunca reaproveite uma `dist/` que já estava na pasta: ela pode ser velha ou do modo demo (o `build:demo` põe o prefixo `/front.abrasce-v2/` e quebra o site inteiro em produção).

```bash
cd ~/projects/front.abrasce-v2/front.abrasce-v2
git checkout main && git pull && git status    # limpo
npm ci                                         # instala exatamente o package-lock.json
npm run build
grep -c 'front.abrasce-v2' dist/index.html     # tem que dar 0. Se der 1 ou mais, é build de demo: NÃO suba
git rev-parse --short HEAD > dist/versao.txt   # marca qual commit está no ar
```

Guarde a versão atual da VPS (é o rollback em 5 segundos) e suba:

```bash
ssh abrasce@82.25.66.239 'rsync -a --delete /opt/abrasce/frontend/dist/ ~/front-anterior/'
rsync -avzn --delete dist/ abrasce@82.25.66.239:/opt/abrasce/frontend/dist/                   # ENSAIO (-n): só lista o que faria
rsync -avz  --delete --delay-updates dist/ abrasce@82.25.66.239:/opt/abrasce/frontend/dist/   # de verdade
curl -s https://abrascesocial.org.br/versao.txt                                               # o commit que você acabou de marcar
```

- A barra no fim de `dist/` importa: ela copia o **conteúdo** da pasta, não a pasta.
- O `--delete` apaga na VPS o que não existe mais no build novo. Com o caminho de destino errado, ele apagaria o que estiver lá. Por isso o ensaio com `-n` vem antes: confira se a lista só tem `index.html`, `assets/...` e `versao.txt`.
- O `--delay-updates` só troca os arquivos no fim da cópia, todos de uma vez. Sem ele, um visitante poderia receber o `index.html` novo apontando para um `.js` que ainda não chegou.
- Quem estava com o site aberto durante o deploy pode precisar dar F5: as páginas são carregadas sob demanda (`lazy`), e os arquivos da versão anterior deixaram de existir.
- O cache não atrapalha: o Caddy serve o `index.html` com `no-cache`, e os arquivos de `assets/` têm um hash no nome, que muda a cada build.

---

## 4. Conferência depois de subir

Numa **janela anônima** do navegador (sem cache nem login antigo):

- [ ] `https://abrascesocial.org.br` abre, com o cadeado.
- [ ] Abrir uma página interna (ex.: uma notícia) e dar **F5**: não pode dar 404.
- [ ] Notícias com capa e anexos aparecem.
- [ ] Login do admin funciona.
- [ ] Upload de um arquivo pelo admin funciona. Depois, apague o arquivo de teste.
- [ ] Um currículo abre logado como admin.
- [ ] **O que esta versão mudou**, testado de propósito.

Nos dias seguintes, fique de olho no UptimeRobot e no `docker compose logs --tail 200 app | grep -i error`.

---

## 5. Casos especiais

| Se a versão nova… | Faça também |
|---|---|
| tem **migration nova** (`db/migration/V<n>__...sql`) | Ensaie antes no Mac contra uma cópia do banco de produção (o `pre-deploy` restaurado num banco local). Lembre-se: depois que ela roda em produção, **voltar o código não desfaz a migration** (seção 6) |
| exige **variável de ambiente nova** (`.env.example` mudou) | Antes do `up`: `nano /opt/abrasce/.env` e acrescente a variável. Sem ela, o `ProdConfigCheck` impede a app de subir e diz qual falta |
| mudou o **`docker-compose.yml`** | `docker compose up -d --build` (sem o `app` no fim): recria todos os serviços que mudaram |
| mudou o **`Caddyfile`** | Valide antes: `docker run --rm -v "$PWD/Caddyfile:/etc/caddy/Caddyfile:ro" caddy:2-alpine caddy validate --config /etc/caddy/Caddyfile`. Depois aplique: `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile` |
| mudou o **`pom.xml`** | Nada a mais. Só o build demora mais, porque o Maven baixa as dependências de novo |
| mudou a **allowlist de extensões** (`file.allowed-extensions.*`) | Espelhe em `src/lib/uploadRules.js` do front e suba os dois juntos |
| mudou a **regra de tipo de arquivo** (`FileKind`) | Espelhe em `src/lib/fileKind.jsx` do front |

---

## 6. Voltar atrás (rollback)

### Frontend

```bash
ssh abrasce@82.25.66.239 'rsync -a --delete ~/front-anterior/ /opt/abrasce/frontend/dist/'
```

Volta na hora, sem build. Depois, corrija na `main` e suba de novo pela seção 3.

### Backend sem migration nova

```bash
cd /opt/abrasce
git checkout <commit-anotado>
docker compose up -d --build app
```

### Backend com migration nova

Voltar o código **não** desfaz a mudança no banco, e o código antigo pode não subir com o schema novo (o `ddl-auto=validate` recusa). É preciso restaurar o banco do `pre-deploy`:

```bash
cd /opt/abrasce
git checkout <commit-anotado>
docker compose stop app
docker compose exec -T db sh -c 'dropdb -U "$POSTGRES_USER" abrascesocial && createdb -U "$POSTGRES_USER" abrascesocial'
gunzip -c ~/pre-deploy-AAAA-MM-DD-HHMM.sql.gz | docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d abrascesocial'
docker compose up -d --build app
```

> O restore **perde tudo o que entrou depois do deploy** (candidaturas, contatos). Antes de restaurar, veja se dá para corrigir com uma migration nova em vez de voltar.

Para sair do commit antigo depois (a VPS fica em *detached HEAD*): `git checkout main && git pull`, quando a correção estiver na `main`.

---

## Resumo (cola rápida)

```bash
# BACKEND (VPS)
cd /opt/abrasce && git log --oneline -1
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" abrascesocial' | gzip > ~/pre-deploy-$(date +%F-%H%M).sql.gz
git pull && docker compose up -d --build app && docker compose logs -f app

# FRONTEND (Mac)
git checkout main && git pull && npm ci && npm run build
grep -c 'front.abrasce-v2' dist/index.html          # 0
git rev-parse --short HEAD > dist/versao.txt
ssh abrasce@82.25.66.239 'rsync -a --delete /opt/abrasce/frontend/dist/ ~/front-anterior/'
rsync -avz --delete --delay-updates dist/ abrasce@82.25.66.239:/opt/abrasce/frontend/dist/
```
