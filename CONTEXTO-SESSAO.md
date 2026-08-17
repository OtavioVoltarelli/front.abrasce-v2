# Contexto da sessão anterior — migração para Tailwind

> Documento de passagem de bastão. Leia junto com o `CLAUDE.md`, que tem as regras
> de trabalho e a dívida técnica catalogada.
> Última atualização: 2026-08-17.

---

## 1. A decisão de fundo: continuar o v2, não recomeçar

O usuário tinha a dúvida "refatoro o v2 ou começo um frontend do zero?". Analisamos
os três frontends que existem em `~/projects`:

| Projeto | O que é |
|---|---|
| `ABRASCE/Front/abrasce` | v1 — CRA, React 18. O site em produção. |
| `ABRASCE/New-Front/abrasce-front` | Tentativa de recomeço do zero (jun/2025), Vite+TS. **Abandonada com 4 componentes.** |
| `front.abrasce-v2/front.abrasce-v2` | **O projeto atual.** Vite, React 19, React Query. |

**Decisão: continuar o v2.** Os argumentos:

- O caminho "do zero" **já foi tentado e morreu** na parte chata (transcrever 30+
  páginas institucionais que já funcionam). É o dado mais forte da análise.
- O v2 nasceu como cópia do v1 (o commit se chama literalmente `clonning v1`), mas
  ganhou uma camada de dados nova e boa: `services/`, `hooks/` com React Query,
  `context/AuthContext`, `PrivateRoute`, `validations/`. Recomeçar joga isso fora.
- O que falta no v2 é justamente CSS e UX — a camada **mais barata de trocar**,
  arquivo por arquivo, sem parar o app. Não é motivo para rewrite.

Comparação arquivo a arquivo feita na época: **44 dos 47 CSS** e **28 dos 54 JSX**
eram byte-a-byte idênticos ao v1.

## 2. Decisão de estilo: Tailwind v4 (já instalado e funcionando)

Escolhido sobre CSS Modules porque **força mobile-first estruturalmente** (classe sem
prefixo = celular, `md:` = daí pra cima), traz escala de espaçamento pronta (mata os
~398 valores em `px` soltos) e elimina o par `style.css` + `media-query.css`.

O problema real do CSS legado **não é "ser CSS puro"** — é usar seletores de elemento
globais (`ul li a { }` no Navbar vale para toda `<ul>` do site). Escopo é a cura.

### Como o Tailwind está configurado

- `vite.config.js` → plugin `@tailwindcss/vite`.
- `src/App.css` → importa o Tailwind **sem o preflight**, de propósito:

  ```css
  @layer theme, base, components, utilities;
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/utilities.css" layer(utilities);
  ```

  **Motivo:** o preflight remove o estilo padrão de `h1`–`h6`. O projeto tem 223
  headings no JSX e só 69 regras de CSS estilizando heading — ligar agora achataria
  o site inteiro. **Ligar no fim da migração**, trocando o bloco acima por
  `@import "tailwindcss";`.

- Design tokens no bloco `@theme` do `App.css` (no v4 a config mora no CSS, não há
  mais `tailwind.config.js`):

  | Token | Valor | Era |
  |---|---|---|
  | `--color-brand` | `#2222FF` | `--color4` |
  | `--color-brand-dark` | `#1C0051` | `--color5` |
  | `--color-brand-light` | `#278CFF` | `--color3` |
  | `--color-accent` | `#00EBFC` | `--color2` |
  | `--color-surface` | `#D7F8F9` | `--color1` |

- `src/colors.css` virou **ponte de compatibilidade**: os ~40 CSS legados usam
  `var(--color4)`, então cada nome antigo aponta para o token novo
  (`--color4: var(--color-brand)`). Uma fonte de verdade só. Conforme os componentes
  migrarem, os `@import` somem e o arquivo pode ser apagado.

## 3. MUI removido

Estava em **um único arquivo** (`components/Loading`), só para um spinner. Medido com
build antes/depois: custava **28,3 kB gzipped**. Reescrito em Tailwind com
`animate-spin` e `motion-reduce:`. `@mui/material`, `@emotion/react` e
`@emotion/styled` foram desinstalados.

## 4. News-Management e RecruitmentProcess — terminados

Estavam **quebrados**: refatorações interrompidas no meio. O JSX do v1 tinha sido
mantido, mas todo o state e os handlers apagados — 47 erros `no-undef`, tela branca
ao carregar. (Atenção: numa análise inicial isso foi lido erroneamente como "refactor
bem-sucedido que encolheu o arquivo". Não era.)

**Arquivos criados:**

- `src/services/fileService.js` — upload compartilhado (`uploadFile`), limites de
  tamanho e helpers de URL (`buildFileUrl`, `buildNewsPdfUrl`).
- `src/pages/News-Management/NewsForm.jsx`
- `src/pages/RecruitmentProcess/RecruitmentProcessForm.jsx`

**Arquivos estendidos:**

- `newsService` / `recruitmentProcessService` → CRUD completo (`getAll`, `create`,
  `update`, `delete`).
- `useNews` / `useRecruitmentProcess` → `useAllX` + mutations com
  `invalidateQueries`, seguindo o padrão que já existia em `useTransparencyAdmin`.
- `AlertModal` → ganhou modo confirmação (props `onConfirm`, `confirmLabel`,
  `isConfirming`). **Retrocompatível** — sem `onConfirm` funciona como antes, e os
  dois usos existentes em `Form-Contact` e `Form-WWU` não foram afetados.

**Decisões técnicas tomadas ali (valem para o resto do projeto):**

- `toReversed()` em vez de `reverse()` — o segundo muta o array, inclusive o do cache
  do React Query.
- `key={item.id ?? 'new'}` no formulário, para o React recriar a instância ao trocar
  de item em vez de manter os valores antigos nos campos.
- `id` dentro de `.map()` virou `className` (id tem que ser único na página). Os dois
  `style.css` foram ajustados junto.
- `alert()` e `window.confirm()` substituídos pelo `AlertModal`. Botões com
  `min-h-11` (44px, alvo de toque) e `flex-col-reverse` no mobile.
- Uploads de imagem e PDF em paralelo com `Promise.all`.

**Resultado:** lint do projeto foi de 66 → 10 erros; **zero** nas duas páginas. Build
passa. Os 10 restantes são pré-existentes e cosméticos (variáveis não usadas em
`Navbar`, `Jobs`, `Candidates`, `WorkWithUs`, `candidateService`, `AuthContext`).

⚠️ **Não foi testado contra o backend rodando** — validado só por lint e build. O
contrato da API foi inferido lendo as páginas do v1. Vale testar criar/editar/excluir
quando o backend v2 estiver de pé.

## 5. Autenticação está desligada de propósito

O `AuthProvider` não envolve o `<App />` e as rotas com `PrivateRoute` estão
comentadas em `AppRoutes.jsx`. **Isso foi uma decisão do usuário**, não um bug: o
backend v2 ainda não tem segurança implementada, e autenticação de verdade se faz no
backend — `PrivateRoute` só esconde a tela.

Não religar até o backend v2 ter segurança. Quando tiver, é descomentar as rotas e
envolver o `<App />`.

Efeito colateral conhecido: **`/login` quebra ao carregar** (consome `AuthContext` sem
provider; desestruturar `undefined` lança). Esperado, some junto.

---

## Estado atual do repositório

**⚠️ Nada foi commitado.** O repositório tem só 2 commits (`first commit`,
`clonning v1`) e **tudo** está na working tree — os ~2 meses de refactor de
`services`/`hooks`/React Query do usuário **mais** todo o trabalho descrito acima.

Commit sugerido antes de qualquer coisa nova:

```bash
git add -A
git commit -m "feat: Tailwind v4, remove MUI e finaliza telas de admin"
```

---

## Próximos passos combinados, em ordem

1. **`.env.production` está vazio** → `VITE_API_URL` vira `undefined` no build de
   produção. Verificado: o JS gerado contém literalmente `undefined/files/` em 3
   lugares. **Pergunta aberta ao usuário:** qual será a URL do backend v2 em
   produção? A do v1 era `https://www.abrascesocial.org.br/api/`.
2. **Migrar a Navbar para Tailwind** — era o plano original. Escolhida por estar em
   toda página e por ser onde a experiência mobile começa (menu hambúrguer). Fazer
   ponta a ponta, testando no celular de verdade, antes de ir para a próxima.
3. Depois da Navbar: Home → Footer → páginas de cidade (essas são muito repetitivas,
   dá para extrair um layout compartilhado e apagar centenas de linhas).
4. **Performance** — provavelmente impacta mais o mobile do que todo o CSS:
   - `dist/index.js` = **256 kB gzipped num arquivo só**, sem code splitting. O
     usuário baixa o site inteiro para ver a home.
   - `src/pages/Home/assets/3.jpg` = **1,3 MB**. Sozinha pesa mais que todo o resto.
5. Ligar o preflight do Tailwind quando não houver mais CSS legado dependendo dos
   estilos padrão do navegador.

---

## Como o usuário quer trabalhar

Está tudo no `CLAUDE.md`, mas o essencial: **ele é iniciante em frontend e o objetivo
declarado é aprender.** Não entregue código pronto — explique o que muda, por que
resolve, por que dessa forma, e qual era o sinal que denunciava o problema. Defina
jargão na hora. Tenha opinião técnica e defenda com argumento.

UX é prioridade nº 1, **mobile-first** (a maior parte dos acessos vem de celular).

Você tem **permissão total para sugerir refatoração** de qualquer código abaixo do
nível "especialista frontend", inclusive código que já funciona — mas **sugerir e
esperar a decisão dele**, nunca consertar em silêncio nem expandir o escopo sozinho.

Comunicação em **português do Brasil**.
