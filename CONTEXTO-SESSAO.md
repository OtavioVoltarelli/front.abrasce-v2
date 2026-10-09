# Contexto da sessão — Redesign V2 (site público + painel admin)

> Documento de passagem de bastão. Leia junto com o `CLAUDE.md`.
> Última atualização: 2026-10-09.

---

## O que foi feito

**Entrega 1** — redesenho completo do site público.
**Entrega 2** — painel administrativo inteiro.
**Entrega 3** — autenticação real com o backend (ver seção própria mais abaixo).
**Ajustes de 2026-10** — hover colorido nos cards, logo em "Quem somos",
extensões e limites de tamanho de upload por categoria, e o aviso de erro de
envio perto do botão (seções próprias mais abaixo).

As entregas 1 e 2 começaram com dados mockados e já foram ligadas ao backend de
verdade (commit `058fb77` e a entrega 3). O modo mock (`VITE_USE_MOCKS`) continua
existindo para desenvolver sem precisar subir o backend, mas não é mais o padrão.

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

### Sistema de cores — `src/lib/palette.js` é a fonte única

O site trabalha com **sete matizes e nem uma a mais**: o azul da marca e as
seis cores das áreas de atuação. Cada matiz tem **cinco papéis**, e cada papel
só serve para uma coisa:

| papel | para quê | regra |
|---|---|---|
| `color` | preencher formas (faixas, pontos, ícones) | **nunca** como texto sobre branco |
| `ink` | texto sobre branco ou sobre `tint` | todos ≥ 4.5:1 |
| `tint` | fundo de etiqueta, card e seção | saturação ~5% |
| `deep` | degradê de cabeçalho escuro | texto branco ≥ 12:1 |
| `bright` | texto sobre fundo escuro | todos ≥ 8.6:1 no azul-marinho |

`src/content/areas.js` não guarda mais hexadecimal nenhum: cada área declara
`accent: 'leaf'` e recebe os cinco tons por spread. Mudar um verde muda junto
o card da área, a etiqueta, a serra do topo e o painel.

**Uma cor por página**, aplicada sempre nos mesmos quatro lugares do
`PageHeader` (degradê, brilho, sobretítulo, filete da base):

| página | acento | painel correspondente |
|---|---|---|
| Home | `brand` | Início |
| Trabalhe conosco | `leaf` (verde) | Processos seletivos |
| Notícias | `coral` | Notícias |
| Contato | `iris` (violeta) | Contatos usa `lagoon` |
| Transparência | `lagoon` (turquesa) | — |
| Projetos | as seis áreas (`rule="areas"`) | — |
| Erro 404 | `sun` (âmbar) | — |

**Nunca monte classe Tailwind concatenando string** — o Tailwind lê o
código-fonte procurando classes por extenso e não encontra as montadas em
tempo de execução. Quando a cor só é conhecida em tempo de execução, use
`style={accentVars('leaf')}` + `bg-[var(--accent-tint)]`. Custa **uma regra**
no CSS final para servir os sete acentos.

Verificado: 28/28 combinações de contraste passam em AA, as 34 cores que
aparecem no HTML gerado pertencem todas à paleta, e não há **nenhum**
hexadecimal escrito direto em arquivo `.jsx`.

### Hover dos cards — o token `--shadow-glow`

Todo card clicável reage do mesmo jeito: sobe 4px, a sombra ganha a cor do
conteúdo e a borda fica na mesma cor a 40%. Só a cor muda, e a cor diz o tipo:

| card | `--glow` | onde aparece |
|---|---|---|
| `AreaCard` | `var(--area)` (cor da área) | Home |
| `NewsCard` | `var(--color-coral)` | Home e Notícias |
| `JobCard` | `var(--color-leaf)` | Trabalhe conosco |

O token fica em `theme.css` e tem duas camadas: uma pequena em azul-marinho
(o "chão" do objeto levantado) e uma difusa na cor de `--glow` a **25%**. Sem
`--glow` definido, cai no azul da marca. O componente escolhe a cor com uma
propriedade arbitrária: `[--glow:var(--color-leaf)] hover:shadow-glow`.

- **25% é decisão do usuário** (50% ficou forte demais, principalmente nas
  listas de Trabalhe conosco, onde o brilho invadia o card vizinho).
- Cards em que o link é só o título (`NewsCard`, `JobCard`) usam
  `has-focus-visible:` para acender também no foco de teclado; o `AreaCard`,
  que é um link inteiro, usa `focus-visible:`.
- `transition-[translate,box-shadow]`, nunca `transition-all`.
- Nas etiquetas das seis áreas no hero da Home, o texto vai para
  `--area-bright` (a única versão com contraste sobre o azul-marinho) e a
  etiqueta cresce para 110% com `scale` — `font-size` empurraria as vizinhas.
  `areaVars` passou a expor `--area-bright` para isso.
- Cards **não clicáveis** (Missão, Visão, Valores) não têm hover de propósito:
  hover promete uma ação que não existe.

O logo da ABRASCE fica na seção "Quem somos" da Home (à direita no desktop,
acima do título no celular). Uma versão no hero, dentro de uma placa branca,
foi tentada e descartada pelo usuário.

---

### Biblioteca de arquivos reutilizáveis

O backend **já tinha** o módulo `reusablefile` pronto quando esta tela foi
feita — entidade, controller, service e três DTOs. O front espelha o contrato
real, não uma invenção.

`ReusableFileOutput` = `{ id, name, storedName, originalName, contentType, kind, usageCount, creationDate }`

`kind` é classificado pelo backend no upload (mesma regra de `lib/fileKind`,
com CSV/TSV contando como planilha). `usageCount` só vem preenchido nas rotas
da biblioteca; dentro de `NewsOutput.coverImage` ele é `null`.

Os três nomes são diferentes de propósito: `name` é o rótulo da biblioteca,
`originalName` é o que a pessoa enviou (e o que ela recebe ao baixar) e
`storedName` é o nome físico (`uuid_arquivo.jpg`), que é o que vai na URL da
imagem.

| Camada | Arquivo |
|---|---|
| Contrato HTTP + chave de mock | `services/reusableFileService.js` |
| Dados falsos (14 arquivos, 4 tipos) | `mocks/reusableFileMock.js` |
| React Query + uso + filtro | `hooks/useReusableFiles.js` |
| Classificação de tipo | `lib/fileKind.jsx` |
| Grade, busca, upload | `pages/admin/MediaLibrary.jsx` |
| Gaveta de ações do arquivo | `components/media/MediaFileSheet.jsx` |
| **Seletor reutilizável** | `components/media/MediaPicker.jsx` |
| **Campo de formulário** | `components/media/MediaField.jsx` |

**`MediaField` + `MediaPicker` são o par reutilizável.** Nenhum dos dois sabe o
que é uma notícia. Para usar a biblioteca em outro formulário amanhã:

```jsx
<MediaField label="Imagem do projeto" kind="image" value={img} onChange={setImg} />
```

### A capa da notícia deixou de ser upload

`News.coverImage` virou `@ManyToOne` para `ReusableFile` e `NewsInput` pede
`coverImageId` (`@NotNull`). Consequências no front, todas já aplicadas:

- `NewsOutput.coverImage` é um **objeto**, não uma String — `NewsCard`,
  `NewsList`, `News/Detail` leem `coverImage.storedName`.
- `PUT /news/{id}/data` virou **JSON puro** (não é mais multipart).
- Criar **e** editar usam o mesmo `MediaField`; ao editar, ele já vem
  preenchido com a capa atual.
- `ImageUpload.jsx` ficou órfão e foi apagado.

### Endereços no texto viram links

`lib/autolink.js` parte o texto em pedaços `{type:'text'|'link'}`; `RichText`
monta os elementos. **Nunca `dangerouslySetInnerHTML`** — o React escapa tudo.

Detecta `https?://`, `www.` e e-mail (vira `mailto:`). Quantos houver no texto.
Vale para notícia **e** processo seletivo, que usam o mesmo `RichText`.

Regras que não podem ser afrouxadas:

- **Lista de permissão de esquemas**: só `http`, `https`, `mailto`. Qualquer
  outro (`javascript:`, `data:`, `file:`) volta a ser texto comum. Mesmo com o
  painel atrás de login, o texto da notícia é digitado por uma pessoa e segue
  sendo conteúdo **não confiável**.
- **Pontuação final não entra na URL** (`…/edital.` → o ponto é da frase), mas
  parêntese que faz parte do endereço é preservado (Wikipédia).
- **Rótulo encurtado** preservando domínio e fim do caminho, mais
  `break-words` — uma URL de 120 caracteres é uma "palavra" só e criaria
  rolagem horizontal em 320px.
- `mailto:` **não** abre aba nova (evita a aba órfã), links de site abrem com
  `rel="noreferrer"` e aviso `sr-only`.

Verificado: 29 casos na lógica pura + 17 no HTML renderizado, incluindo 6
tentativas de injeção.

### Exclusão com integridade

O backend recusa apagar um arquivo em uso. O card e a gaveta leem
`file.usageCount`, que já vem com o arquivo, e por isso o botão de excluir nasce
travado ou liberado sem esperar nada. A gaveta busca **quais** conteúdos usam o
arquivo em `GET /reusable-files/{id}/usages` (paginado: uma capa padrão pode
estar em centenas de notícias).

(Antes da paginação, `useFileUsage` cruzava a biblioteca com a lista inteira de
notícias em cache. Isso deixou de funcionar quando "a lista inteira" deixou de
existir no navegador.)

### Paginação — "Carregar mais" em toda listagem

Nenhuma listagem pede mais `size=100` fingindo que é "tudo". O caminho é:

| Camada | Arquivo | Papel |
|---|---|---|
| Service | `services/pagination.js` | `toPage` achata o `PagedModel` do Spring em `{ items, page, totalPages, totalElements }`; `fetchAllItems` percorre as páginas quando "tudo" é mesmo o requisito |
| Mock | `mocks/paginate.js` | recorta a lista em memória no mesmo formato |
| Hook | `hooks/usePagedQuery.js` | `useInfiniteQuery` devolvendo `data` como array só, e com `QueryBoundary` funcionando igual |
| UI | `components/feedback/LoadMore.jsx` | "Mostrando X de Y" + botão de 44px |

Decisões:
- **Botão, não rolagem infinita**: a rolagem infinita deixa o rodapé
  inalcançável e gasta dados do 4G com itens que ninguém pediu.
- **Totais vêm do servidor** (`totalElements`). O Dashboard pede páginas de
  1 item só para ler o total, em vez de baixar tudo para contar.
- **Exportar para Excel busca o período inteiro no clique** (`loadRows`), não
  as páginas que estão na tela.
- **O `<select>` de processos em Candidatos usa `fetchAllItems`**: ali "todos"
  é o requisito, e o cadastro é pequeno.
- **A busca da biblioteca roda no servidor** (`?search=&kind=`), com
  `useDebouncedValue` (300 ms), para uma palavra digitada virar uma requisição,
  e não uma por letra.
- Tamanhos: notícias públicas 12, biblioteca 24, seletor de mídia 12, vagas
  públicas 10, listas do painel 20.

### Regras de upload por categoria — `src/lib/uploadRules.js`

O backend recusa com 400 toda extensão fora da lista da categoria
(`file.allowed-extensions.<categoria>` no `application.properties`). O front
espelha as cinco listas para o seletor de arquivos nem oferecer o que seria
recusado:

| categoria (`ALLOWED_EXTENSIONS`) | quem usa |
|---|---|
| `cv` | `CandidateForm` |
| `recruitmentProcess` | `RecruitmentForm` |
| `news` | `NewsForm` |
| `library` (no backend: `admin`) | `MediaUploadPanel`, `MediaPicker`, `MediaFileSheet` |
| `transparency` | `TransparencyCreateModal` |

- As listas são escritas **por extenso**, na ordem do backend, mesmo
  repetindo extensões — para serem conferidas lado a lado com o
  `application.properties`. **Se o backend mudar uma lista, esta muda junto.**
- `acceptFor(categoria)` dá o `accept`; `libraryAcceptFor(kind)` restringe a
  biblioteca a imagens quando o campo é `kind="image"`;
  `hasAllowedExtension(categoria, nome)` valida antes do envio.
- **Tamanho** (`MAX_FILE_SIZE_MB`): currículo **2 MB**, todo o resto **10 MB**
  por arquivo, e **50 MB** somando um envio inteiro (`MAX_REQUEST_SIZE_MB`).
  1 MB = 1024 × 1024 bytes, como o Spring conta. Acima disso o backend
  responde 413.
- **Texto dos formatos** (`FORMATS_LABEL`): o que aparece dentro do campo
  ("PDF ou Word · até 2 MB"). Mora ao lado das extensões porque muda junto.
- `FileUpload` e `MultiFileUpload` recebem **só `category`** (obrigatória, sem
  padrão) e tiram dela o `accept`, o limite e o texto. Antes eram três props
  soltas, e cada uma envelheceu de um jeito: o `accept` padrão
  (`.pdf,.doc,.docx`) fazia os anexos oferecerem só PDF e Word, o texto ficou
  fixo em "PDF ou Word" e a transparência anunciava 15 MB sem validar.
- Anexos (notícia, processo seletivo): `validations/uploadValidation.js` →
  `validateAttachments(categoria, files)` devolve uma mensagem (arquivo grande
  demais primeiro, depois a soma) ou `null`. O formulário calcula a cada
  render, passa por `error` ao `MultiFileUpload`, bloqueia o envio e rola até
  o campo (`id="files"` no `FIELD_ORDER`). O componente marca em `berry` o
  arquivo que passou do limite.
- O currículo é validado pela **extensão**, não pelo tipo MIME, que varia por
  sistema operacional (no Android um `.odt` costuma chegar sem tipo).
- O `accept` é só conveniência. **Segurança é o backend**: allowlist no
  upload, `Content-Type` decidido pela extensão salva (não pelo que o cliente
  manda), `nosniff` e `inline` só para PNG, JPEG, GIF, WebP e PDF — o resto,
  inclusive SVG e HTML, é baixado como anexo.

### Aviso de erro de envio — `components/feedback/SubmitError.jsx`

Candidatura e contato mostram o erro do servidor (limite de envios, duplicata,
sem conexão) **logo acima do botão de enviar**, não no topo do formulário. No
celular o formulário ocupa várias telas: com o aviso no topo, a pessoa tocava
em "Enviar", o aviso aparecia fora da tela e ela tocava de novo — gastando
tentativas do limite por hora. Sem resposta do servidor (`error.response`
vazio) o texto é próprio, porque o axios preencheria "Network Error" em
inglês. Cores `berry` da paleta, `role="alert"` para o leitor de tela.

## Autenticação

O backend v2 já tinha o módulo de auth pronto (`AuthController`, JWT stateless,
`SecurityConfig` protegendo tudo por padrão) quando esta parte foi feita. O front
espelha o contrato real:

```
POST /api/auth/login   { email, password } → { token, email, role }
```

| Camada | Arquivo |
|---|---|
| Contrato HTTP (sem modo mock, ver abaixo) | `services/authService.js` |
| Estado global de "quem está logado" | `context/authContext.js` + `AuthProvider.jsx` |
| Atalho pra ler o context | `hooks/useAuth.js` |
| Mutação de login (React Query) | `hooks/useLogin.js` |
| Tela de login | `pages/Login/index.jsx` |
| Portão das rotas `/admin` | `routes/PrivateRoute.jsx` |
| Interceptors (token na requisição, 401 na resposta) | `services/api.js` |

**Sem modo mock aqui**, diferente de todo outro service: dá pra fingir uma lista de
notícias, não dá pra fingir "esta senha está certa" sem duplicar a lógica de
autenticação do backend dentro do front. Consequência: com `VITE_USE_MOCKS=true`,
o site público funciona igual, mas o painel fica inacessível (sem login de verdade,
o `PrivateRoute` nunca tem token pra mostrar).

**Onde o token mora:** `localStorage`, na chave `AUTH_STORAGE_KEY` (`services/api.js`,
exportada de lá porque é o único arquivo dos dois lados — quem salva e quem lê —
que o outro importa sem criar dependência circular). O `AuthProvider` lê essa chave
uma vez, no primeiro render (`useState(readStoredAuth)`), o que faz um F5 não
deslogar ninguém.

**Os dois interceptors do `api.js` fazem o trabalho pesado:**
1. **Requisição:** gruda `Authorization: Bearer <token>` em toda chamada
   automaticamente. Sem isso, cada um dos 9 services precisaria lembrar de montar o
   header na mão — e como o backend agora protege quase tudo por padrão
   (`anyRequest().authenticated()`), um esquecimento quebraria a tela em 401 sem
   aviso. A leitura do `localStorage` é protegida por `try/catch`: um JSON
   corrompido não pode quebrar toda chamada de API (isso já aconteceu — ver a
   correção na tabela abaixo).
2. **Resposta:** traduz `error.response.data.detail` (o `ProblemDetail` do backend)
   pra `error.message`, e em qualquer 401 que não seja o próprio `/auth/login`
   (senha errada é erro diferente de sessão expirada) limpa o token e manda a
   pessoa pra `/login` com `window.location.href` — recarga completa de propósito,
   porque o interceptor roda fora de qualquer componente e não tem acesso ao
   `navigate()` do React Router, e a recarga também zera o cache do React Query
   (que pode ter dado de outra pessoa).

**Verificado contra o backend local** (usuário seed do `AdminSeeder`,
`admin@abrasce.com.br` / `admin123`): o formato de sucesso e de erro do
`POST /api/auth/login` bate exatamente com o que o front espera, e o token gerado
autentica normalmente numa rota protegida. Testado manualmente no navegador —
funcionou.

Único papel existe hoje no backend (`Role.ADMIN` — ver comentário no enum: "um
papel só por enquanto"), então o front não faz nenhuma distinção de permissão por
`role`; ele só guarda e exibe.

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
| `api.js` | Interceptor de requisição lia o token do `localStorage` sem `try/catch`, diferente do `AuthProvider`. Um JSON corrompido quebraria toda chamada de API com um erro genérico em vez de cair no login. |
| `ExportButton` | Recebia `rows` prontas; com paginação exportaria só as 20 primeiras linhas sem aviso. Agora recebe `loadRows()`. |
| `Dashboard` | Esqueleto girando para sempre se a contagem falhasse; e o aviso "dados de demonstração" aparecia mesmo ligado ao backend real (agora só em modo mock). |
| Biblioteca de arquivos | O seletor aceitava qualquer tipo e o backend recusava `.svg`/`.odt` só DEPOIS do upload. `lib/uploadRules.js` espelha a lista do backend no `accept`. |
| `FileUpload`, `MultiFileUpload` | `accept` padrão `.pdf,.doc,.docx` era herdado pelos anexos de notícia e de processo seletivo, que ofereciam só PDF e Word. Padrão removido; cada campo declara a categoria. |
| `candidateValidation` | Checava o tipo MIME do currículo e deixava passar qualquer arquivo sem tipo. Agora checa a extensão, como o backend. |
| `TransparencyCreateModal` | Tinha lista de extensões própria, divergente do backend (`gif` a mais; faltavam `odt`, `ods`, `tsv`). Agora usa `uploadRules`. |
| `TransparencyCreateModal` | Anunciava "até 15 MB", mas o backend aceita 10 MB — e nem validava: arquivo grande subia inteiro e levava 413. Agora valida em 10 MB e bloqueia o envio. |
| `FileUpload` | Texto "PDF ou Word" fixo no componente, errado na transparência. Agora vem de `FORMATS_LABEL` da categoria. |
| `CandidateForm`, `ContactForm` | Aviso de erro do servidor no topo, fora da tela no celular; `bg-red-*` do Tailwind fora da paleta; "Network Error" em inglês sem conexão. → `SubmitError` acima do botão. |
| `content/areas.js` | Comentário do `areaVars` estava em cima de `AREAS`, falava em "quatro tons" (são cinco) e `findArea` vinha antes de `AREAS`. |
| `Candidates.jsx`, `AttachmentList.jsx`, `MultiFileUpload.jsx` | Três lugares ainda tratavam anexo/currículo como STRING (`candidate.cvUrl`, `filesPath`/`filesPaths` como array de nome de arquivo). O backend já manda objeto (`StoredFileOutput` — `storedName`, `originalName`, `contentType` — ou `CandidateOutput.cv`). Achado numa troca de contrato com a sessão do backend; conferido contra o `NewsController`/`CandidateOutput.java` e contra dados reais do backend local antes de corrigir. |

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
| Imagens do build | 709 kB, do jeito que foram salvas | 293 kB (`vite-plugin-image-optimizer`, qualidade 75) |

---

## Verificado

- `npm run lint` → 0 erros. `npm run build` → passa.
- Renderização no servidor de **23 páginas/componentes** → todas sem erro.
- **12 verificações de comportamento** nos services: criar/editar/excluir,
  ordenação, estados vazios, isolamento do cache e a armadilha do filtro de
  data (o "até 15/08" que descartava o dia 15 inteiro).
- Contraste WCAG AA (4.5:1): 17 combinações medidas, **todas passam**.
- Nenhuma `<table>`, nenhuma largura fixa grande, nenhum alvo de toque < 44px.
- **O fluxo de autenticação foi testado manualmente no navegador** (login, erro de
  senha errada, logout) e funcionou. **O resto do redesenho segue sem teste em
  navegador nem em celular real.** Em 2026-09-28 a extensão do Chrome não estava
  conectada e a máquina não tem navegador headless.
- Paginação (2026-09-28), testada contra o backend local em `:8080`: páginas sem
  item repetido, ordem, `attachments`, total de abertos, `kind` do servidor igual
  ao `fileKind` do front nos 5 tipos, busca sem diferenciar maiúsculas e sem `%`
  virar coringa, `usageCount` == `/usages` == notícias com aquela capa, telefone
  do contato como texto. A mesma bateria em modo mock. Renderização no servidor
  das 9 telas alteradas e do `LoadMore` nos quatro estados.
- Hover e extensões (2026-10-08): `lint` e `build` passam; as classes novas
  conferidas no CSS gerado; as cinco listas de `uploadRules` conferidas item
  por item contra o `application.properties` do backend. **Nada disso foi
  aberto num navegador** — a extensão do Chrome seguiu desconectada. Não foram
  feitos uploads de teste contra o `:8080`, para não criar registros no banco
  local.
- Limites de tamanho (2026-10-09): bordas testadas fora do navegador —
  currículo de 2 MB exatos passa e 2 MB + 1 byte não; 10 MB exatos passam;
  seis anexos de 9 MB são recusados pela soma (54 MB); 50 MB exatos passam.

---

## Pendências

1. **`.env.production` continua sem a URL do backend.** Qual é a URL do
   backend v2 em produção? (a da v1 era `https://www.abrascesocial.org.br/api`).
   Bloqueia o login e todas as chamadas no site publicado.
2. **Testar no celular de verdade**, começando pelo site público. Nenhuma tela
   além do login foi aberta num navegador — incluindo os hovers e os campos de
   upload de 2026-10.
3. **Migração dos arquivos da v1**: antes de copiar, procurar `.svg`, `.htm*` e
   `.xml` (registrado também no `CLAUDE.md` do backend). O backend já serve
   esses tipos como anexo, mas o ideal é que nem entrem.
4. **`npm audit`**: `axios`, `react-router` e `vite` têm correção por
   atualização; `xlsx` não tem correção no npm. Ver `CLAUDE.md`.
5. **Arrastar arquivo ignora o `accept`** (`FileUpload`). Na transparência,
   um arquivo arrastado no desktop com extensão proibida só é recusado pelo
   backend, depois do envio (o tamanho já é validado). O currículo já está
   coberto pela validação. Correção: `hasAllowedExtension` ao receber o
   arquivo, com erro no campo.
6. **Filtros "Documentos" e "Planilhas" da biblioteca**: a biblioteca agora só
   aceita imagem e PDF. Os filtros só fazem sentido se houver arquivos antigos
   desses tipos; se não houver, podem sair.
7. **Fotos das áreas** são 300×300 e genéricas. Depende de a ABRASCE fornecer
   fotos reais dos projetos.
8. **Hover nos links do rodapé e da navbar** (sublinhado animado): sugerido,
   ainda não decidido.
9. **Branch `feat/paleta-biblioteca-de-arquivos`** sem push e sem merge na
   `main` (o backend também tem commits sem push).
10. **Biblioteca não valida tamanho** (`MediaUploadPanel`): arquivo acima de
    10 MB sobe inteiro e leva 413. Correção: `exceedsMaxSize('library', file)`.
11. **`formatFileSize` usa ponto decimal** ("54.0 MB"); em português é
    "54,0 MB". Usado no site todo; correção com `toLocaleString('pt-BR')`.
12. **Margem do limite de 50 MB**: o front aceita exatamente 50 MB de anexos,
    mas a requisição leva também o JSON da notícia (alguns KB). Raríssimo;
    se quiser rigor, deixar uma margem pequena.

---

## Contrato com o backend

Tudo o que o front pedia ao backend foi entregue (sessão `back-agent`,
2026-09-28): atualizar notícia numa chamada só, filtro de data em contatos,
busca e `kind` na biblioteca, `usageCount` + `/usages`, `attachments` no lugar
de `filesPath`/`filesPaths`, e `Contact.phoneNumber` como String (migration
V3; o zero à esquerda que já tinha se perdido nos dados antigos não volta).

Contrato novo de 2026-10 (backend `488b9b4`, `2d473a8`):

- **Login com limite de tentativas:** 5 senhas erradas para o mesmo e-mail+IP
  em 15 min → `429` com `Retry-After` (segundos) e `detail` em português. O
  `api.js` já mostra o `detail`, então o front não precisou mudar. A contagem
  regressiva no botão foi **descartada pelo usuário**.
- **Extensões por categoria:** ver a seção de `uploadRules` acima.
- **Tamanho:** currículo 2 MB (`file.max-size.cv`), demais 10 MB por arquivo,
  50 MB por requisição. Acima → `413`, title "Arquivo muito grande", `detail`
  em português. O Caddy de produção não impõe limite de corpo.
- **Limite por IP nos formulários públicos:** `POST /api/candidates` 10 envios
  por hora, `POST /api/contacts` 5 por hora — todo envio conta, inclusive os
  que dão 400. Estourou → `429` com `Retry-After` e `detail` em português. O
  title do 429 (inclusive o do login) é "Muitas requisições"; o front não usa
  o title.
- **Download:** `inline` só para uma allowlist explícita de tipos (PNG, JPEG,
  GIF, WebP, PDF). Antes era o prefixo `image/`, que deixava SVG — que pode
  conter `<script>` — abrir no navegador na origem da API. Achado nesta
  sessão, corrigido pelo backend com teste.
