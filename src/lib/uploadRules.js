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
    /* POST /api/candidates — currículo do candidato. */
    cv: ['pdf', 'doc', 'docx', 'odt'],
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
 * O arquivo tem uma extensão aceita na categoria? Para validar ANTES do
 * envio: o `accept` só filtra o seletor — arquivo arrastado para a página
 * passa direto por ele.
 */
export const hasAllowedExtension = (category, fileName) =>
    ALLOWED_EXTENSIONS[category].includes(extensionOf(fileName));
