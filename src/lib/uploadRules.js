/**
 * Quais arquivos o backend aceita receber, por categoria de upload.
 *
 * Espelha `file.allowed-extensions.<categoria>` do backend v2
 * (application.properties). Quem manda é o servidor — ele recusa o resto com
 * 400 e lista as extensões permitidas no `detail`; esta cópia existe para o
 * seletor de arquivos nem OFERECER o que seria recusado. Sem ela, a pessoa
 * escolhe um .svg no celular, espera o upload inteiro no 4G e só então
 * descobre que não podia.
 *
 * As listas são escritas POR EXTENSO, uma por categoria, na mesma ordem do
 * backend — mesmo repetindo extensões entre elas. Montá-las a partir de
 * pedaços em comum (`[...OFFICE, ...IMAGES]`) economizaria linhas, mas
 * quebraria o único uso desta tabela: ser conferida lado a lado com o
 * application.properties. Se o backend mudar uma lista, esta muda junto.
 */
export const ALLOWED_EXTENSIONS = {
    /* POST /api/candidates — currículo do candidato. Aceita foto porque, na
       v1, ~1 em cada 5 currículos chegava como foto ou print do celular. */
    cv: ['pdf', 'doc', 'docx', 'odt', 'png', 'jpg', 'jpeg', 'webp'],
    /* Edital e anexos de processo seletivo. */
    recruitmentProcess: [
        'pdf', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods', 'csv', 'tsv',
        'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'webp', 'zip',
    ],
    /* Anexos de notícia: os do processo seletivo + gif. */
    news: [
        'pdf', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods', 'csv', 'tsv',
        'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'zip',
    ],
    /* /api/reusable-files — biblioteca de arquivos (no backend: `admin`). */
    library: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf'],
    /* Arquivos da transparência: os do processo seletivo + txt. */
    transparency: [
        'pdf', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ods', 'csv', 'tsv',
        'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'webp', 'zip', 'txt',
    ],
};

/**
 * Tamanho máximo por arquivo, em MB, por categoria. Espelha o backend:
 * `file.max-size.cv` para o currículo e `spring.servlet.multipart.max-file-size`
 * para todo o resto. Acima disso o servidor responde 413 — validar antes
 * evita a pessoa esperar o upload inteiro no 4G para só então ser recusada.
 */
export const MAX_FILE_SIZE_MB = {
    cv: 2,
    recruitmentProcess: 10,
    news: 10,
    library: 10,
    transparency: 10,
};

/**
 * Teto de uma requisição inteira, em MB — a soma de todos os arquivos de um
 * envio (`spring.servlet.multipart.max-request-size`). Só pesa onde dá para
 * mandar vários arquivos de uma vez: seis anexos de 9 MB passam um a um, mas
 * juntos (54 MB) a requisição inteira é recusada.
 */
export const MAX_REQUEST_SIZE_MB = 50;

const BYTES_PER_MB = 1024 * 1024; // como o Spring conta "10MB"

/** O arquivo passa do tamanho máximo da categoria? */
export const exceedsMaxSize = (category, file) =>
    file.size > MAX_FILE_SIZE_MB[category] * BYTES_PER_MB;

/** A soma dos arquivos passa do teto de uma requisição? */
export const exceedsRequestSize = (files) =>
    files.reduce((total, file) => total + file.size, 0) > MAX_REQUEST_SIZE_MB * BYTES_PER_MB;

/**
 * Como cada categoria descreve, para gente, o que aceita. Aparece dentro do
 * campo de upload ("PDF ou Word · até 2 MB"). Mora aqui, ao lado da lista de
 * extensões, porque as duas precisam mudar juntas.
 */
export const FORMATS_LABEL = {
    cv: 'PDF, Word ou foto',
    recruitmentProcess: 'PDF, Word, planilha, apresentação, imagem ou .zip',
    news: 'PDF, Word, planilha, apresentação, imagem (inclusive GIF) ou .zip',
    library: 'Imagem ou PDF',
    transparency: 'PDF, Word, planilha, apresentação, imagem, .txt ou .zip',
};

/* Imagens da biblioteca, para campos que só aceitam imagem (a capa de uma
   notícia). Não é `image/*`: isso ofereceria SVG, AVIF e HEIC, que o backend
   recusa. (No iPhone, pedir extensões de imagem faz o sistema converter a
   foto HEIC para JPEG sozinho antes de entregar ao site.) */
const LIBRARY_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

const toAccept = (extensions) => extensions.map((extension) => `.${extension}`).join(',');

const extensionOf = (fileName = '') => fileName.split('.').pop().toLowerCase();

/** Valor do atributo `accept` do <input type="file"> de uma categoria. */
export const acceptFor = (category) => toAccept(ALLOWED_EXTENSIONS[category]);

/**
 * `accept` da biblioteca, conforme o tipo que o campo pede. Um campo de
 * imagem (`kind="image"`) oferece só imagens; qualquer outro, a biblioteca
 * inteira.
 */
export const libraryAcceptFor = (kind) =>
    toAccept(kind === 'image' ? LIBRARY_IMAGE_EXTENSIONS : ALLOWED_EXTENSIONS.library);

/**
 * O que impede um arquivo escolhido de ser enviado a um campo — ou `null`.
 *
 * Confere tipo e tamanho ANTES do envio. O `accept` do <input> só filtra o
 * seletor (e o Android costuma ignorá-lo): sem isto, um PDF escolhido no
 * seletor de CAPA virava capa de notícia, e um arquivo de 30 MB subia
 * inteiro no 4G só para o servidor recusar. A lista de extensões vem do
 * próprio `accept`, para valer o que o campo pede (só imagens, ou a
 * biblioteca inteira); o tamanho vem da `category`.
 */
export function chosenFileProblem(file, accept, category) {
    if (!file) return null;

    const allowed = accept.split(',').map((item) => item.trim().replace(/^\./, '').toLowerCase());
    if (!allowed.includes(extensionOf(file.name))) {
        return `Este tipo de arquivo não é aceito aqui. Escolha: ${allowed.join(', ')}.`;
    }
    if (exceedsMaxSize(category, file)) {
        return `O arquivo passa de ${MAX_FILE_SIZE_MB[category]} MB. Envie uma versão menor.`;
    }
    return null;
}

/**
 * O arquivo tem uma extensão aceita na categoria? Para validar ANTES do
 * envio: o `accept` só filtra o seletor — arquivo arrastado para a página
 * passa direto por ele.
 */
export const hasAllowedExtension = (category, fileName) =>
    ALLOWED_EXTENSIONS[category].includes(extensionOf(fileName));
