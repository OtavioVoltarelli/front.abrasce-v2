/**
 * Estrutura de navegação do site.
 *
 * A ordem aqui é a ordem definida pela ABRASCE e é a MESMA no menu do desktop,
 * no menu do celular e no rodapé. Manter os três lendo desta lista é o que
 * impede o clássico "mudei o menu e esqueci o rodapé".
 */

export const PUBLIC_NAV = [
    { to: '/', label: 'Home' },
    { to: '/trabalhe-conosco', label: 'Trabalhe conosco' },
    { to: '/noticias', label: 'Notícias' },
    { to: '/projetos', label: 'Projetos' },
    { to: '/contato', label: 'Contato' },
    { to: '/transparencia', label: 'Transparência' },
];

export const ADMIN_NAV = [
    { to: '/admin', label: 'Início', end: true },
    { to: '/admin/processos-seletivos', label: 'Processos seletivos' },
    { to: '/admin/noticias', label: 'Notícias' },
    { to: '/admin/candidatos', label: 'Candidatos' },
    { to: '/admin/contatos', label: 'Contatos' },
];
