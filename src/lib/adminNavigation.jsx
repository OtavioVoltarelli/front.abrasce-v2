/**
 * Itens do painel administrativo — rótulo, rota e ícone.
 *
 * Ficam num arquivo só porque a mesma lista alimenta três lugares: a barra
 * inferior do celular, a barra lateral do desktop e os cartões da tela
 * inicial. Escrever a lista três vezes é garantia de que uma delas fica para
 * trás na próxima mudança.
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

export const ADMIN_NAV = [
    {
        to: '/admin',
        end: true,
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
        to: '/admin/candidatos',
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
];
