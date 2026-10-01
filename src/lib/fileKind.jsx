/**
 * Classificação de tipo de arquivo para a biblioteca de arquivos reutilizáveis.
 * ---------------------------------------------------------------------------
 * O backend guarda `contentType` no `ReusableFile`, mas o comentário da própria
 * entidade avisa que ele "vem do multipart, ou seja, do cliente" — e por isso
 * NÃO é usado para servir o arquivo. Se o backend não confia nele para decidir
 * o Content-Type do download, o front também não deveria confiar cegamente.
 *
 * Daí a ordem aqui: tenta o `contentType`; se ele vier vazio, errado ou
 * genérico (`application/octet-stream` — o que o navegador manda quando não
 * reconhece o arquivo), cai para a EXTENSÃO do nome original. Duas fontes
 * fracas conferidas na ordem certa valem mais que uma fonte só.
 *
 * Cada tipo tem um acento da paleta do site. A cor aqui é funcional: numa
 * grade de trinta arquivos, a cor do ícone é o que separa PDF de planilha
 * antes de qualquer leitura.
 */

const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
};

/* A folha de papel com o canto dobrado é a base de todos os ícones de
   documento — muda só o desenho de dentro. Repetir a moldura faz a grade
   parecer um conjunto em vez de ícones avulsos de origens diferentes. */
/* É uma FUNÇÃO chamada como `sheet(...)`, não um componente usado como
   como um componente JSX. A diferença importa para o linter: um arquivo que define
   componentes e exporta outras coisas quebra o hot reload do Vite, e a regra
   `react-refresh/only-export-components` avisa sobre isso. Como aqui o
   objetivo é só montar um pedaço de SVG, função resolve. */
const sheet = (inner) => (
    <svg {...iconProps}>
        <path d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        {inner}
    </svg>
);

export const FILE_KINDS = [
    {
        id: 'image',
        label: 'Imagens',
        singular: 'Imagem',
        accent: 'iris',
        mime: /^image\//,
        extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg'],
        icon: (
            <svg {...iconProps}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="9.5" r="1.6" />
                <path d="m4 17 4.5-4.5 3 3L15 12l5 5" />
            </svg>
        ),
    },
    {
        id: 'pdf',
        label: 'PDFs',
        singular: 'PDF',
        accent: 'berry',
        mime: /^application\/pdf$/,
        extensions: ['pdf'],
        icon: sheet(<path d="M8.5 13h1.2a1.4 1.4 0 0 1 0 2.8H8.5V13v5M13.5 18v-5h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2z" />),
    },
    {
        id: 'document',
        label: 'Documentos',
        singular: 'Documento',
        accent: 'brand',
        // `text/` menos CSV e TSV: os dois são texto puro por dentro, mas quem
        // abre um CSV espera uma planilha. Sem a exceção, `text/csv` seria
        // capturado aqui antes de chegar à regra de planilhas logo abaixo.
        mime: /^(application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml|text\/(?!csv|tab-separated-values))/,
        extensions: ['doc', 'docx', 'odt', 'txt', 'rtf'],
        icon: sheet(<path d="M8.5 12.5h7M8.5 15.5h7M8.5 18.5h4" />),
    },
    {
        id: 'spreadsheet',
        label: 'Planilhas',
        singular: 'Planilha',
        accent: 'leaf',
        mime: /^(application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml|text\/(csv|tab-separated-values))/,
        extensions: ['xls', 'xlsx', 'ods', 'csv', 'tsv'],
        icon: sheet(<path d="M8 12.5h8M8 16h8M12 12.5V19" />),
    },
];

/* Último recurso: nunca devolvemos `undefined`, porque um tipo desconhecido
   ainda precisa de um ícone e de um rótulo na tela. */
const UNKNOWN = {
    id: 'other',
    label: 'Outros',
    singular: 'Arquivo',
    accent: 'lagoon',
    mime: null,
    extensions: [],
    icon: sheet(<path d="M12 12v3M12 17.5h.01" />),
};

/* `application/octet-stream` significa literalmente "uma sequência de bytes":
   é o que o navegador manda quando não faz ideia do que é o arquivo. Tratar
   isso como um tipo real classificaria metade da biblioteca como "Outros". */
const GENERIC_MIME = /^(application\/octet-stream|binary\/octet-stream)?$/i;

function extensionOf(fileName = '') {
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex > 0 ? fileName.slice(dotIndex + 1).toLowerCase() : '';
}

/**
 * Descobre o tipo de um arquivo da biblioteca.
 * Aceita tanto um `ReusableFileOutput` do backend quanto um `File` do
 * navegador (o que a pessoa acabou de escolher, antes de subir) — os dois
 * têm `type`/`contentType` e um nome, e a tela de upload precisa classificar
 * o arquivo para mostrar a pré-visualização certa ANTES de salvar.
 *
 * Quando o arquivo já vem do backend com `kind`, é ele que vale: o servidor
 * classifica com esta mesma regra e FILTRA por ela (`?kind=`). Se o front
 * reclassificasse por conta própria, um arquivo poderia aparecer no filtro
 * "PDFs" com o ícone de "Outros".
 */
export function fileKind(file) {
    if (!file) return UNKNOWN;

    if (file.kind) {
        return FILE_KINDS.find((kind) => kind.id === file.kind) ?? UNKNOWN;
    }

    const mime = file.contentType ?? file.type ?? '';
    const name = file.originalName ?? file.name ?? '';

    if (!GENERIC_MIME.test(mime)) {
        const byMime = FILE_KINDS.find((kind) => kind.mime.test(mime));
        if (byMime) return byMime;
    }

    const extension = extensionOf(name);
    return FILE_KINDS.find((kind) => kind.extensions.includes(extension)) ?? UNKNOWN;
}

export const isImage = (file) => fileKind(file).id === 'image';
