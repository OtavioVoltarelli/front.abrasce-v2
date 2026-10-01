/**
 * Quais arquivos o backend aceita receber.
 *
 * Espelha `file.allowed-extensions` do backend v2. Quem manda é o servidor
 * (ele recusa o resto com 400 "Extensão não permitida"); esta cópia existe
 * para o seletor de arquivos nem OFERECER o que seria recusado. Sem ela, a
 * pessoa escolhe um .svg no celular, espera o upload inteiro no 4G e só
 * então descobre que não podia.
 *
 * Se o backend mudar a lista, esta muda junto — é o preço de avisar antes.
 */
const ALLOWED_EXTENSIONS = [
    'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp',
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'zip',
];

/* Subconjunto de imagem. Não é `image/*`: isso ofereceria SVG, AVIF e HEIC,
   que o backend recusa. (No iPhone, pedir extensões de imagem faz o sistema
   converter a foto HEIC para JPEG sozinho antes de entregar ao site.) */
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

const toAccept = (extensions) => extensions.map((extension) => `.${extension}`).join(',');

/** Valor do atributo `accept` do <input type="file">, por tipo de arquivo. */
export const acceptFor = (kind) =>
    toAccept(kind === 'image' ? IMAGE_EXTENSIONS : ALLOWED_EXTENSIONS);
