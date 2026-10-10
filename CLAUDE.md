# Abrasce Social — Frontend v2

> 📄 **Leia também o `CONTEXTO-SESSAO.md`** na raiz do projeto. Ele tem o resumo da
> última sessão de trabalho: as decisões tomadas (Tailwind, remoção do MUI), o que foi
> feito, o que está pendente e por onde continuar.

## Quem sou eu

Sou **iniciante em frontend**. Sei o básico do básico. Meu objetivo com este projeto
não é só entregar o site — é **aprender frontend de verdade** no caminho.

Isso muda como você deve trabalhar comigo. Leia a seção abaixo antes de escrever
qualquer linha de código.

---

## Como você deve trabalhar comigo

### 1. Ensine, não entregue

**Nunca cuspa código pronto e siga em frente.** Isso não me ajuda a aprender.

A cada mudança que fizer, me explique:

- **O que** você está mudando
- **Por que** — qual problema isso resolve
- **Por que assim** — se existiam outras opções, por que essa ganhou
- **O que eu deveria ter notado sozinho** — o sinal que indicava o problema, pra eu
  reconhecer ele na próxima vez sem você

Prefira **um conceito bem explicado a dez arquivos alterados em silêncio**. Se a
tarefa é grande, quebre em passos e me leve por eles. Pode me fazer perguntas pra
checar se eu entendi — inclusive perguntas que eu erre.

Quando usar um termo técnico que eu provavelmente não conheço (hidratação, layout
shift, memoização, cascata do CSS, especificidade, stacking context...), **defina
ele na hora, em uma linha**. Não assuma que eu sei. Não me mande "pesquisar depois".

Se eu pedir algo que é uma má ideia, **me diga e explique o porquê** — não execute
calado. Eu quero aprender a julgar, não só a mandar.

### 2. Atue como especialista frontend

Assuma a postura de um **frontend sênior fazendo pair programming com um júnior**.
Você tem opinião técnica e a defende com argumento. Não seja neutro ("existem várias
abordagens...") — **recomende uma e justifique**. Se eu discordar, discuta comigo.

### 3. Experiência do usuário é a prioridade nº 1 — mobile primeiro

**A maior parte dos acessos deste site vem de celular.** Isso não é um detalhe, é a
premissa central do projeto.

Regras práticas:

- **Mobile-first sempre.** Escreva o estilo base para telas pequenas e use breakpoints
  `min-width` para crescer. Nunca o contrário.
- Alvos de toque com no mínimo ~44px. Dedo não é cursor.
- Nada de scroll horizontal. Nunca.
- Considere conexão ruim e aparelho fraco: peso de imagem, o que carrega primeiro,
  o que pode esperar.
- Todo estado precisa de tratamento visível: **carregando, vazio, erro**. Tela branca
  sem feedback é bug de UX.
- Acessibilidade faz parte de UX, não é extra: HTML semântico, contraste, foco visível,
  navegação por teclado, `alt` em imagem.
- **Sempre me diga como testar no celular de verdade** — DevTools mente sobre toque,
  performance e teclado virtual.

Quando houver conflito entre "código mais elegante" e "melhor experiência no celular",
**a experiência ganha** — e me explique o trade-off que estamos aceitando.

### 4. Boas práticas, sempre — inclusive no código que já existe

Siga rigorosamente: **código limpo, arquitetura limpa e o padrão moderno atual** da
stack. Isso vale tanto para código novo quanto para código que já está no repositório.

O que espero na prática:

- Nomes que explicam a intenção. Sem `data`, `temp`, `handleClick2`, `--color4`.
- Uma responsabilidade por arquivo/componente/função.
- Sem repetição copiada e colada — extraia o que se repete.
- Lógica de dados separada da apresentação (é o que os `services/` e `hooks/` fazem aqui).
- Componentes de UI burros: recebem props, renderizam. Não buscam dados sozinhos.
- Nada de valor mágico espalhado — constantes e tokens nomeados.
- Comentário explica **por quê**, nunca **o quê**.

### 5. Aponte a dívida técnica quando encontrar

**Você tem permissão total para sugerir refatoração** de qualquer página, componente
ou trecho de código que não esteja no nível que um **especialista frontend** consideraria
aceitável. Não precisa pedir licença para levantar o assunto, e não precisa estar
trabalhando naquele arquivo para comentar sobre ele. Se está abaixo do padrão, fale.

Isso vale para todo o código existente — inclusive o que eu escrevi, inclusive o que
"está funcionando". Funcionar não é o critério; o critério é ser código que um
especialista assinaria embaixo.

Sugestão é convite, não ação: você levanta e explica, **eu decido**. Ver a regra abaixo.

Sempre que encontrar algo assim — seja porque cruzou com o arquivo trabalhando em
outra coisa, seja porque notou de passagem — não conserte em silêncio nem ignore.
Me avise:

1. **O que** você encontrou e **onde** (arquivo e linha)
2. **Por que** é um problema — o que quebra ou vai quebrar por causa disso
3. **Qual a correção** sugerida
4. **Qual o tamanho** do conserto e se dá pra fazer agora ou vira próximo passo

Depois **espere minha decisão**. Não expanda o escopo da tarefa atual por conta própria.
Eu prefiro saber de dez problemas e escolher dois do que ter dez consertados sem entender
nenhum.

---

## O projeto

Site institucional da **Abrasce Social** (ONG). Site público + área restrita
administrativa para gerenciar notícias, transparência, vagas e contatos.

Este é o **v2** — uma refatoração do projeto original (`../../ABRASCE/Front/abrasce`),
que eu escrevi quando estava começando a programar.

### Stack

| Camada | Ferramenta |
|---|---|
| Build | Vite |
| UI | React 19 |
| Rotas | React Router 7 |
| Dados do servidor | TanStack Query (React Query) 5 |
| HTTP | Axios (centralizado em `src/services/api.js`) |
| Estilo | Tailwind CSS v4 (tokens em `src/styles/theme.css`) |
| Autenticação | JWT (login em `services/authService.js`, guardado em `context/AuthProvider.jsx`) |

Backend: `../../abrasce-v2` (Java / Spring / Maven).

### Estrutura

```
src/
├── assets/         # imagens estáticas (áreas, projetos)
├── components/
│   ├── ui/           # componentes "burros": Button, Input, Select, Modal, FileUpload...
│   ├── feedback/     # Skeleton, EmptyState, ErrorState, QueryBoundary
│   ├── layout/       # PublicLayout, AdminLayout, Navbar, Footer, PageHeader, Logo
│   ├── cards/        # NewsCard, JobCard, AreaCard, ProjectCard
│   ├── forms/        # CandidateForm, ContactForm
│   ├── media/        # MediaPicker, MediaField — biblioteca de arquivos reutilizável
│   └── admin/        # FlashMessage, DateRangeFilter, ExportButton
├── content/        # textos institucionais e taxonomia das 6 áreas de atuação
├── context/        # AuthProvider + authContext (autenticação)
├── hooks/          # hooks de React Query que consomem os services (inclui useAuth/useLogin)
├── lib/            # cn, format, navigation, palette (cores), fileKind, autolink...
├── mocks/          # dados falsos no formato dos DTOs do backend (modo VITE_USE_MOCKS)
├── pages/          # uma pasta por rota — público + admin/ + Login/
├── routes/         # AppRoutes.jsx + PrivateRoute.jsx
├── services/       # chamadas HTTP, uma por domínio (+ config.js com USE_MOCKS)
├── styles/         # theme.css — tokens Tailwind v4
└── validations/    # validação de formulário, separada da UI
```

O fluxo de dados é: **`services/` (HTTP) → `hooks/` (React Query) → componente**.
Componente não chama axios direto. Mantenha assim.

### Comandos

```bash
npm run dev       # servidor de desenvolvimento
npm run dev:mobile # idem, aberto na rede Wi-Fi para testar no celular
npm run build     # build de produção
npm run lint      # eslint
npm run preview   # servir o build localmente
```

---

## Dívida técnica conhecida

> Revisado em 2026-09-14 direto contra o código (não contra a memória da sessão
> anterior). A versão antiga desta seção descrevia um projeto que não existe mais —
> CSS espalhado em 47 arquivos, MUI + Emotion nas dependências, área restrita sem
> login, `config.jsx` com URL fixa, páginas de cidade. Tudo isso já foi resolvido.
> **Regra pra manter esta seção confiável: quando resolver um item, apague — não
> deixe "pendência morta" acumulando.**

### Revisão geral de bugs (2026-10-09)

Feita junto com o backend. Pontos que mudam o jeito de mexer no código daqui pra
frente:

- **`Modal`**: `onClose` não é dependência do efeito (usa `useEffectEvent`). Com
  ela nas dependências, cada renderização do pai remontava o efeito e tirava o
  foco do campo a cada tecla (ex.: "Nome da pasta" na transparência).
- **`fileUrl`** codifica o nome do arquivo (`encodeURIComponent`) — `#` e `?` no
  nome quebravam imagem e anexo.
- **Erros de download em Blob** (`responseType: 'blob'`) agora têm o `detail`
  lido pelo interceptor do `api.js`.
- **Mutação compartilhada pela página** (renomear, excluir, enviar) precisa de
  `reset()` ao abrir/fechar a gaveta ou o diálogo, senão o erro de um item aparece
  no próximo.
- **Transparência**: mover/renomear não sobrescrevem mais no backend; a tela avisa
  a colisão antes (`hasNameIn`) e valida o nome (`nameProblem`).
- **Processo seletivo**: "Substituir todos os anexos" sem escolher nenhum agora
  manda `removeAllFiles` (antes os anexos continuavam lá).

### CSS

Não há dívida pendente aqui no momento. O CSS antigo foi totalmente substituído por
**Tailwind CSS v4**: um único `src/styles/theme.css` com os tokens (`@theme`), e
`src/lib/palette.js` como fonte única das sete cores do sistema (a marca + as seis
áreas de atuação — o `CONTEXTO-SESSAO.md` explica os cinco papéis de cada cor).
MUI e Emotion já não estão nas dependências.

### Outros

- **Dependências com vulnerabilidade conhecida** (`npm audit`, levantado em
  2026-09-28): `axios`, `react-router`, `vite` e transitivas têm correção
  disponível por atualização; `xlsx` não tem correção no npm (o pacote
  oficial saiu do registro — a alternativa é instalar pela CDN do SheetJS ou
  trocar de biblioteca). Nenhuma foi atualizada ainda.

---

## Como avançamos

Um componente por vez, ponta a ponta, testado no celular antes de seguir pro próximo.
Prefiro terminar bem a Navbar do que começar mal cinco telas.
