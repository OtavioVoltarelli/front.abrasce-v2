/**
 * Itens do painel administrativo — rótulo, rota e ícone.
 *
 * Ficam num arquivo só porque a mesma lista alimenta três lugares: a barra
 * inferior do celular, a barra lateral do desktop e os cartões da tela
 * inicial. Escrever a lista três vezes é garantia de que uma delas fica para
 * trás na próxima mudança.
 *
 * Cada item tem um ACENTO, e ele é o mesmo do site público: Processos usa o
 * verde de "Trabalhe conosco", Notícias o coral da página de Notícias,
 * Contatos o turquesa. Isso não é decoração — no celular o painel não tem
 * espaço para migalhas de navegação ("Painel > Notícias > Editar"), então a
 * cor é o que responde "onde eu estou?" de relance. E quem administra o site
 * aprende a associação uma vez só, porque ela vale nos dois lados.
 *
 * Os ícones são SVG escritos aqui, e não de uma biblioteca: são cinco
 * desenhos simples: importar um pacote de ícones para isso custa mais
 * quilobytes do que o painel inteiro.
 */

const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
};

/**
 * `inBottomBar: false` tira o item da barra inferior do celular, mas o mantém
 * na coluna lateral do desktop.
 *
 * Motivo medido: com SEIS itens, uma tela de 320px dá 53px por célula, e
 * "Candidatos" a 11px precisa de ~57px. O rótulo quebraria ou seria cortado no
 * meio. Sobraram três saídas — diminuir a fonte (abaixo de 10px vira ilegível),
 * abreviar rótulos ("Candid.", que ninguém lê melhor), ou tirar um item.
 *
 * Saiu o "Início": é a tela que menos se visita no celular (a barra inferior já
 * leva direto a todas as seções, que é o que o painel de Início oferece), e ela
 * continua a um toque de distância pelo título "Painel ABRASCE" no topo. As
 * cinco seções de TRABALHO ficam onde o polegar alcança.
 */
export const ADMIN_NAV = [
    {
        to: '/admin',
        accent: 'brand',
        end: true,
        inBottomBar: false,
        label: 'Início',
        description: 'Visão geral do painel',
        icon: (
            <svg {...iconProps}>
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
            </svg>
        ),
    },
    {
        to: '/admin/processos-seletivos',
        accent: 'leaf',
        label: 'Processos',
        fullLabel: 'Processos seletivos',
        description: 'Criar, editar e encerrar vagas',
        icon: (
            <svg {...iconProps}>
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
            </svg>
        ),
    },
    {
        to: '/admin/noticias',
        accent: 'coral',
        label: 'Notícias',
        fullLabel: 'Notícias',
        description: 'Publicar e editar notícias',
        icon: (
            <svg {...iconProps}>
                <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                <path d="M8 9h7M8 13h7M8 17h4" />
            </svg>
        ),
    },
    {
        to: '/admin/arquivos',
        accent: 'sun',
        label: 'Arquivos',
        fullLabel: 'Arquivos reutilizáveis',
        description: 'Imagens, PDFs e documentos',
        icon: (
            <svg {...iconProps}>
                <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8h9a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                <circle cx="9.5" cy="12.5" r="1.3" />
                <path d="m7 16 2.6-2.4 2 1.8L14.5 12l3 3.5" />
            </svg>
        ),
    },
    {
        to: '/admin/candidatos',
        accent: 'iris',
        label: 'Candidatos',
        fullLabel: 'Candidatos',
        description: 'Consultar inscrições e exportar',
        icon: (
            <svg {...iconProps}>
                <circle cx="9" cy="8" r="3.2" />
                <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
                <path d="M16 8.5h5M18.5 6v5" />
            </svg>
        ),
    },
    {
        to: '/admin/contatos',
        accent: 'lagoon',
        label: 'Contatos',
        fullLabel: 'Contatos',
        description: 'Ler mensagens e exportar',
        icon: (
            <svg {...iconProps}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </svg>
        ),
    },
    /**
     * Fora da barra inferior, pelo mesmo motivo do "Início": não é algo que
     * se mexe todo dia (diferente de Notícias/Processos), e um 6º item ali
     * reabriria o problema de largura que tirou o "Início" de lá. Fica na
     * coluna do desktop e num atalho na tela inicial do painel.
     *
     * O acento reaproveita `lagoon` — a MESMA cor da página de Transparência
     * pública, mesmo já usada por "Contatos" aqui na coluna. As duas nunca
     * aparecem lado a lado na barra inferior (Transparência não está nela),
     * então a repetição não confunde "onde estou" — e a associação com a
     * página pública vale mais que uma cor exclusiva só pra esta seção.
     */
    {
        to: '/admin/transparencia',
        accent: 'lagoon',
        inBottomBar: false,
        label: 'Transparência',
        fullLabel: 'Transparência',
        description: 'Balanços, certidões e relatórios',
        icon: (
            <svg {...iconProps}>
                <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
];
