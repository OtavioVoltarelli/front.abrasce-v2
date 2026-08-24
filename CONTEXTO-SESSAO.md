# Contexto da sessão — Redesign V2 (site público + painel admin)

> Documento de passagem de bastão. Leia junto com o `CLAUDE.md`.
> Última atualização: 2026-08-20.

---

## O que foi feito

**Entrega 1** — redesenho completo do site público.
**Entrega 2** — painel administrativo inteiro.
As duas com dados mockados; nada foi ligado ao backend ainda.

Três decisões foram tomadas pelo usuário no início:

1. **Ritmo:** site público inteiro → revisar → depois o admin.
2. **Direção visual:** "Território" — azul institucional + as seis áreas de
   atuação como sistema de cores.
3. **`pages/Cities/*`:** apagadas (16 rotas da transparência da v1, apontavam
   para endpoints inexistentes no backend v2). Estão no commit `979614d`.

---

## Arquitetura nova

```
src/
├── styles/theme.css      Tailwind v4 + tokens (@theme). Preflight LIGADO.
├── content/              Textos institucionais e taxonomia das 6 áreas.
├── mocks/                Dados falsos com o FORMATO dos DTOs do backend v2.
├── services/             HTTP real + chave USE_MOCKS.
├── hooks/                React Query.
├── lib/                  cn, format, navigation, brazilianStates.
├── validations/          candidateValidation, contactValidation.
├── components/
│   ├── ui/               Button, Input, Select, Textarea, Field, FileUpload,
│   │                     Modal, ConfirmDialog, Badge, Spinner, Container,
│   │                     SectionHeading, TriangleMark, controlClasses
│   ├── feedback/         Skeleton, EmptyState, ErrorState, QueryBoundary
│   ├── layout/           PublicLayout, Navbar, Footer, PageHeader, Logo
│   ├── cards/            NewsCard, JobCard, AreaCard, ProjectCard
│   ├── forms/            CandidateForm, ContactForm
│   ├── AreaRange.jsx     A "serra" — elemento de assinatura do site
│   ├── AttachmentList.jsx
│   └── RichText.jsx
│   ├── admin/            AdminPage, FlashMessage, DateRangeFilter, ExportButton
│   └── layout/AdminLayout.jsx
├── pages/
│   ├── (público)         Home, WorkWithUs(+Detail), News(+Detail), Projects,
│   │                     Contact, Transparency, NotFound
│   └── admin/            Dashboard, RecruitmentList, RecruitmentForm,
│                         NewsList, NewsForm, Candidates, Contacts
└── routes/AppRoutes.jsx  Duas rotas de layout + React.lazy + redirects
```

### Rotas do painel

```
/admin                              Dashboard
/admin/processos-seletivos          listagem
/admin/processos-seletivos/novo     criar
/admin/processos-seletivos/:id      editar + excluir
/admin/noticias                     listagem
/admin/noticias/nova                criar
/admin/noticias/:id                 editar + excluir
/admin/candidatos                   consulta + exportar
/admin/contatos                     consulta + modal + exportar
```

### Decisões do painel

- **Barra inferior no celular**, não menu hambúrguer. O painel é feito de
  pulos entre seções; hambúrguer custa dois toques e esconde onde você está.
  A partir de 1024px vira coluna lateral.
- **Cards, não tabelas.** Nove colunas de candidato não cabem em 360px.
  Viraram listas de definição (`<dl>`), que empilham.
- **A `xlsx` só é baixada ao clicar em Exportar** (`await import('xlsx')`).
  São 136 kB gzip que quem só consulta nunca paga.
- **Ver a mensagem do contato não faz requisição nova** — `ContactOutput` já
  traz o texto inteiro na listagem; o modal lê da memória.
- **Excluir tem três barreiras**: fica numa "zona de perigo" separada, no fim
  da tela de edição, atrás de uma confirmação.
- **Campo de arquivo em branco = "não mexi nisso"**, nunca "apague". Sem essa
  distinção, editar só o título limparia a capa e os anexos.

### A chave do modo mock

`src/services/config.js` exporta `USE_MOCKS`, lida de `VITE_USE_MOCKS`.
Cada service termina com:

```js
export const newsService = USE_MOCKS ? newsMockService : newsHttpService;
```

**Para integrar com o backend:** `VITE_USE_MOCKS=false` no `.env.development`,
subir o backend, testar, e então apagar `src/mocks/` e os ternários.

### Sistema de cores das áreas

`src/content/areas.js` é a fonte única. Cada área tem `color` / `ink` / `tint`.
Os componentes injetam via `style={areaVars(area)}` e usam `bg-[var(--area)]`.
**Nunca monte classe Tailwind concatenando string** — o Tailwind lê o
código-fonte procurando classes por extenso e não encontra as montadas em
tempo de execução.

---

## Correções feitas no caminho

| Onde | O quê |
|---|---|
| `eslint.config.js` | Faltava `eslint-plugin-react`. Sem ele o ESLint não entende JSX; a regra `varsIgnorePattern: '^[A-Z_]'` mascarava isso ignorando todo componente. Instalado; a exceção foi removida. |
| `transparencyAdminService` | `BASE = 'api/admin/transparency'` gerava `/api/api/...` (404 em tudo). |
| `Transparency` | Árvore com `width={1800}` (scroll horizontal no celular) e `localhost:8080` escrito no componente. |
| `candidateService` | Endpoint `/candidates/process/{id}` não existe no v2. É `/candidates/recruitment-process?recruitmentProcessId=…`. |
| `newsService` | `/news/top` é paginado (`PagedModel`); o envelope agora é desembrulhado no service. |
| `contactService` | `phoneNumber` é `Long` no backend; a conversão passou a acontecer no service. |
| `Footer` | `malito:` → `mailto:`. |
| `Navbar` | `document.getElementById(...).style` e listener de `resize` → CSS + estado. |
| `PublicLayout` | Âncoras (`/projetos#esporte`) eram ignoradas na navegação entre rotas. |
| `theme.css` | `overflow-x: hidden` no body quebraria `position: sticky` → trocado por `clip`. |
| `FlashMessage`, `ImageUpload` | `setState` dentro de `useEffect` → ajuste de estado durante a renderização (padrão oficial do React). |
| `ImageUpload` | `URL.createObjectURL` sem `revokeObjectURL` vazava memória a cada troca de imagem. |
| Barra inferior | "Candidatos" a 11px estoura a célula de 64px num aparelho de 320px → 10px até 359px. |
| `Button` | `mailto:` e `tel:` abriam uma aba em branco órfã antes de acionar o aplicativo. |

---

## Performance

| | Antes | Depois |
|---|---|---|
| JS | 256 kB gzip **num arquivo só** | 66 kB compartilhado + pedaço por página |
| Total gerado | — | 335 kB gzip, dos quais 136 são a `xlsx` sob demanda |
| CSS | 47 arquivos | 1 arquivo, 9,2 kB gzip |
| Carrossel da Home | 3 imagens, **2 MB** | removido |
| Mapas do Contato | 2 iframes de imediato | 1 por vez, com `loading="lazy"` |
| `xlsx` | no pacote de todo mundo | só ao clicar em Exportar |

---

## Verificado

- `npm run lint` → 0 erros. `npm run build` → passa.
- Renderização no servidor de **23 páginas/componentes** → todas sem erro.
- **12 verificações de comportamento** nos services: criar/editar/excluir,
  ordenação, estados vazios, isolamento do cache e a armadilha do filtro de
  data (o "até 15/08" que descartava o dia 15 inteiro).
- Contraste WCAG AA (4.5:1): 17 combinações medidas, **todas passam**.
- Nenhuma `<table>`, nenhuma largura fixa grande, nenhum alvo de toque < 44px.
- **NÃO foi testado em navegador nem em celular real** — não havia ferramenta
  de navegador na sessão. É o primeiro passo da revisão.

---

## Pendências

1. **`.env.production` continua sem a URL do backend.** Pergunta aberta: qual
   é a URL do backend v2 em produção? (a da v1 era
   `https://www.abrascesocial.org.br/api`)
2. **Autenticação foi removida** junto com o painel antigo: `AuthContext`,
   `PrivateRoute` e a página `/login` não existem mais. Isso segue o combinado
   (o backend v2 não tem segurança e o briefing dispensou proteção de rota
   nesta etapa), mas precisa voltar antes de qualquer publicação.
3. **Dependências agora sem uso:** `js-cookie` (era do AuthContext) e
   `@tanstack/react-query-devtools` (nunca foi ligado). `xlsx` volta a ser
   usada na Entrega 2 (exportar candidatos e contatos).
4. **`transparencyAdminService.js` ficou órfão.** A tela de administração da
   transparência não está no escopo do novo painel; o service foi mantido para
   a funcionalidade não se perder. Decidir o destino dela.
5. As fotos das áreas são 300×300 e genéricas. Fotos reais dos projetos
   melhorariam muito a página de Projetos e a Home.

---

## Mudanças que o BACKEND precisa antes da integração

Levantadas lendo `NewsController`, `RecruitmentProcessController` e
`NewsService` do projeto `abrasce-v2`:

1. **Não existe upload da imagem de capa da notícia.** `NewsInput.coverImagePath`
   é uma String `@NotBlank`, e a parte `"files"` do POST vira a lista de
   ANEXOS. Hoje o administrador teria que digitar o nome de um arquivo que já
   esteja no servidor. O formulário do painel oferece o upload, que é o certo;
   falta o backend aceitar a capa como uma parte do multipart.

2. **A parte `"files"` é obrigatória** em `POST /news`,
   `POST /recruitment-process` e `PUT /recruitment-process/{id}`. Sem
   `required = false`, criar sem anexo devolve 400 — mas o briefing diz que
   notícia e processo PODEM não ter anexo.

3. **Atualizar notícia exige duas chamadas** (`PUT {id}/data` e
   `PUT {id}/attachment`). Se a segunda falhar, a notícia fica com o texto novo
   e os anexos velhos, sem nada avisando. O ideal é um endpoint só.

4. **`GET /api/contacts` não tem filtro de data.** O recorte por período
   acontece no navegador. Funciona para centenas de contatos; passando disso,
   o endpoint precisa dos mesmos parâmetros que o de candidatos.

5. **Inconsistências de nome** entre entidades: `filesPath` (notícia) x
   `filesPaths` (processo); `phoneNumber` é `String` em candidato e `Long` em
   contato. O front está espelhando exatamente como está — não "arrumei" no
   mock de propósito, senão a integração quebraria sem explicação.
