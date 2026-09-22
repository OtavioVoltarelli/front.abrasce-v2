/**
 * Textos institucionais da ABRASCE.
 * ---------------------------------------------------------------------------
 * Todo o conteúdo aqui é o texto ORIGINAL do site, preservado palavra por
 * palavra. Ele vive num arquivo de dados, e não solto dentro do JSX, por três
 * motivos práticos:
 *
 *  1. O mesmo texto aparece em mais de um lugar (o endereço está na Home, no
 *     rodapé e na página de Contato). Uma fonte só evita que eles divirjam.
 *  2. Se a ABRASCE quiser corrigir o endereço, ela mexe num arquivo de texto,
 *     não numa página de layout.
 *  3. Layout e conteúdo ficam separados — dá para redesenhar a página sem
 *     risco de apagar um parágrafo por acidente.
 */

export const ORGANIZATION = {
    name: 'ABRASCE Social',
    fullName: 'Associação Brasileira de Apoio a Saúde, a Cultura e a Educação',
    acronym: 'ABRASCE',
    foundedYear: 2008,
    cnpj: '09.428.862/0001-94',
};

export const ABOUT = {
    heading: 'Quem somos?',
    text: 'A Associação Brasileira de Apoio a Saúde, a Cultura e a Educação - ABRASCE - foi fundada em 15 de janeiro de 2008, no município de São Paulo (Capital), sob a forma de entidade de interesse social e utilidade pública, sendo atualmente uma entidade da sociedade civil sem fins lucrativos, com sede na Rua Paulo De Faria, 146, Andar 10 Conjunto 1006, Vila Gustavo - CEP 02.267-000 - São Paulo/SP, inscrita no CNPJ sob nº 09.428.862/0001-94.',
};

export const MISSION = {
    heading: 'Nossa missão:',
    text: 'Promover o bem-estar e a inclusão social por meio de iniciativas que atendam às necessidades da comunidade, oferecendo suporte em saúde, educação e cultura.',
};

export const VISION = {
    heading: 'Nossa visão:',
    text: 'Ser uma referência em ações sociais transformadoras, inspirando outras organizações e mobilizando a sociedade para um mundo mais justo e igualitário.',
};

/** Os cinco valores, já separados em nome + definição (no site atual vinham
 *  colados num parágrafo com <strong>). Separar permite dar hierarquia visual
 *  ao nome do valor sem alterar uma vírgula do texto. */
export const VALUES = {
    heading: 'Nossos valores:',
    items: [
        { name: 'Compromisso', text: 'Dedicamo-nos a trabalhar incansavelmente pelo bem-estar da comunidade.' },
        { name: 'Respeito', text: 'Valorizamos a dignidade e os direitos de todas as pessoas.' },
        { name: 'Soliedariedade', text: 'Acreditamos na importância de apoiar uns aos outros em tempos de necessidade.' },
        { name: 'Transparência', text: 'Atuamos com clareza e honestidade em todas as nossas ações e comunicações.' },
        { name: 'Inovação', text: 'Buscamos constantemente novas formas de impactar positivamente a vida das pessoas.' },
    ],
};

export const PROJECTS_TAGLINE = 'Mudando o presente, transformando o futuro.';

export const TRANSPARENCY_TEXT = [
    'A ABRASCE (Associação Brasileira de Apoio a Saúde, a Cultura e a Educação) entende a importância da prestação de contas no terceiro setor e valoriza a transparência e a responsabilidade financeira como pilares fundamentais para manter a confiança de seus doadores e colaboradores.',
    'Para isso, a ABRASCE tem como compromisso prestar contas de forma clara e transparente sobre as atividades desenvolvidas e os recursos financeiros gerenciados pela associação, garantindo que as informações sejam acessíveis e compreensíveis a todos os interessados.',
    'A prestação de contas da ABRASCE inclui a apresentação regular de demonstrações financeiras auditadas, relatórios de atividades, lista de parceiros, certidões negativas de débitos e outras informações relevantes para avaliação do desempenho da organização.',
];

export const CONTACT = {
    email: 'contato@abrascesocial.org.br',
    phone: {
        label: '(11) 3262-3043',
        href: 'tel:+551132623043',
    },
    addresses: [
        {
            id: 'sede',
            label: 'Sede — São Paulo',
            /** Único endereço exibido no rodapé — ver `showInFooter` abaixo. */
            showInFooter: true,
            lines: [
                'Rua Paulo de Faria - 146 - Vila Gustavo',
                'Andar 10 Conj 1006',
                'CEP: 02.267-000 - São Paulo',
            ],
            mapSrc:
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.5210136225123!2d-46.604561863207906!3d-23.482455553094404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef738b03d9841%3A0x9883a9990ed82dce!2sR.%20Paulo%20de%20Faria%2C%20146%20-%20Vila%20Gustavo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002267-000!5e0!3m2!1spt-BR!2sbr!4v1730751518105!5m2!1spt-BR!2sbr',
            mapLink: 'https://www.google.com/maps/search/?api=1&query=Rua+Paulo+de+Faria+146+Vila+Gustavo+São+Paulo',
        },
        {
            id: 'casa-branca',
            label: 'Unidade — Casa Branca',
            lines: [
                'Rua Justino de Castro nº 240 - Centro',
                'Casa Branca - SP',
                'CEP: 13.700-109',
            ],
            mapSrc:
                'https://www.google.com/maps?q=Rua+Justino+de+Castro+240+Centro+Casa+Branca+SP&output=embed',
            mapLink: 'https://www.google.com/maps/search/?api=1&query=Rua+Justino+de+Castro+240+Centro+Casa+Branca+SP',
        },
        {
            id: 'francisco-morato',
            label: 'Unidade — Francisco Morato',
            lines: [
                'Rua Progresso, 657 - Centro',
                'Francisco Morato - SP',
                'CEP: 07901-170',
            ],
            mapSrc:
                'https://www.google.com/maps?q=Rua+Progresso+657+Centro+Francisco+Morato+SP&output=embed',
            mapLink: 'https://www.google.com/maps/search/?api=1&query=Rua+Progresso+657+Centro+Francisco+Morato+SP',
        },
    ],
};
