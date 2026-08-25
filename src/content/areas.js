/**
 * As seis áreas de atuação da ABRASCE.
 * ---------------------------------------------------------------------------
 * Este arquivo é o CORAÇÃO DO SISTEMA VISUAL do site. Cada área tem uma cor
 * própria, e essa cor aparece sempre no mesmo papel: a faixa lateral do card,
 * o ponto ao lado do título, o fundo da etiqueta. Assim a cor deixa de ser
 * enfeite e passa a carregar informação — o leitor aprende, sem ninguém
 * explicar, que verde é assistência social.
 *
 * Por que cores em JS e não em classes do Tailwind?
 * O Tailwind lê o código-fonte procurando classes escritas por extenso. Uma
 * classe montada em tempo de execução (`text-${cor}-600`) nunca é encontrada e
 * some do CSS final. Aqui os componentes injetam a cor como variável CSS
 * (`style={{ '--area': area.color }}`) e usam `bg-[var(--area)]`, que É uma
 * string literal no código. Resultado: adicionar uma sétima área amanhã não
 * exige tocar em nada de Tailwind.
 *
 * Cada área tem três tons com papéis distintos:
 *   color -> a cor cheia, para preencher formas (faixas, pontos, fundos)
 *   ink   -> versão escurecida, a ÚNICA aprovada para texto sobre branco
 *            (todas passam de 4.5:1 de contraste, o mínimo da WCAG AA)
 *   tint  -> versão bem clara, para fundo de etiqueta com o `ink` por cima
 *
 * Os textos são os originais do site atual, preservados palavra por palavra.
 */

import { PALETTE } from '../lib/palette';

import educacao from '../assets/areas/educacao.jpg';
import esporte from '../assets/areas/esporte.jpg';
import lazer from '../assets/areas/lazer.jpg';
import saude from '../assets/areas/saude.jpg';
import cultura from '../assets/areas/cultura.jpg';
import assistenciaSocial from '../assets/areas/assistencia-social.jpg';

const AREA_DEFINITIONS = [
    {
        slug: 'educacao',
        label: 'Educação',
        projectTitle: 'Projetos educacionais',
        accent: 'brand',
        image: educacao,
        imageAlt: 'Corredor de uma biblioteca com estantes cheias de livros',
        summary:
            'Promovemos o acesso ao conhecimento com programas que capacitam jovens e adultos. Nossa missão é abrir portas para o crescimento pessoal e profissional através da educação.',
        description:
            'Visamos promover o aprendizado e o desenvolvimento pessoal por meio de iniciativas voltadas à educação formal e informal. Nossa organização desenvolve programas que abrangem desde reforço escolar até cursos de qualificação profissional, buscando oferecer oportunidades para que crianças, jovens e adultos ampliem seu conhecimento e construam um futuro mais promissor. Acreditamos que a educação é a base para o crescimento social e individual, e nosso objetivo é tornar o aprendizado acessível e transformador para todas as idades.',
    },
    {
        slug: 'esporte',
        label: 'Esporte',
        projectTitle: 'Projetos esportivos',
        accent: 'lagoon',
        image: esporte,
        imageAlt: 'Pessoas praticando atividade esportiva ao ar livre',
        summary:
            'O esporte é um agente de inclusão e transformação. Promovemos atividades que incentivam o trabalho em equipe, a saúde e a disciplina, fortalecendo a convivência e os vínculos sociais',
        description:
            'Nossos projetos esportivos incentivam a prática de atividades físicas como um caminho para a saúde, disciplina e desenvolvimento pessoal. Com atividades que vão desde escolinhas de esporte até competições e eventos esportivos, buscamos envolver crianças, jovens e adultos em uma rotina saudável, onde o esporte é uma ferramenta de inclusão e transformação. Esses projetos são criados para inspirar o espírito de equipe, a superação de limites e o respeito ao próximo, valores essenciais que o esporte ensina e que contribuem para a formação de cidadãos comprometidos com o bem-estar coletivo.',
    },
    {
        slug: 'lazer',
        label: 'Lazer',
        projectTitle: 'Projetos de lazer',
        accent: 'sun',
        image: lazer,
        imageAlt: 'Grupo reunido em um momento de lazer',
        summary:
            'Oferecemos momentos de lazer para melhorar o bem-estar da comunidade. Com eventos culturais e atividades recreativas, promovemos integração e saúde mental.',
        description:
            'Os projetos de lazer são voltados ao bem-estar e à qualidade de vida, oferecendo atividades recreativas e culturais que promovem momentos de relaxamento, integração social e entretenimento para todos os públicos. Com ações que incluem eventos, oficinas de arte, cinema e atividades lúdicas, buscamos proporcionar espaços de convivência e diversão, onde a comunidade possa desfrutar de experiências enriquecedoras. Esses projetos incentivam a criatividade, a expressão cultural e o fortalecimento dos laços sociais, essenciais para uma vida saudável e equilibrada.',
    },
    {
        slug: 'saude',
        label: 'Saúde',
        projectTitle: 'Projetos de saúde',
        accent: 'berry',
        image: saude,
        imageAlt: 'Profissional de saúde em atendimento à comunidade',
        summary:
            'Apoiamos a saúde comunitária com ações de prevenção e conscientização. Nosso objetivo é que todos tenham acesso a informações e cuidados essenciais para uma vida saudável.',
        description:
            'Temos como objetivo promover o bem-estar físico e mental da comunidade, oferecendo ações preventivas e de conscientização sobre temas fundamentais para uma vida saudável. Por meio de campanhas de saúde, atendimento básico e palestras educativas, buscamos capacitar os participantes para adotarem hábitos mais saudáveis e cuidar melhor de si mesmos e de suas famílias. Estes projetos são desenvolvidos com a missão de construir uma sociedade mais informada, ativa e comprometida com a prevenção de doenças e a promoção da saúde.',
    },
    {
        slug: 'cultura',
        label: 'Cultura',
        projectTitle: 'Projetos culturais',
        accent: 'iris',
        image: cultura,
        imageAlt: 'Apresentação cultural com participação da comunidade',
        summary:
            'Promovemos a cultura local por meio de eventos e oficinas que celebram a diversidade, incentivando o acesso à arte e ao patrimônio cultural da comunidade.',
        description:
            'O Projeto Cultural visa enriquecer a comunidade com acesso e incentivo a atividades culturais, promovendo eventos e oficinas que celebram a diversidade e o patrimônio cultural local. Esses projetos estimulam a criatividade e a expressão artística, além de contribuir para a formação de um senso de identidade e pertencimento. Com o propósito de fortalecer o envolvimento da comunidade, o projeto valoriza as tradições e inovações culturais, proporcionando experiências transformadoras que ampliam o horizonte cultural de todos os envolvidos.',
    },
    {
        slug: 'assistencia-social',
        label: 'Assistência social',
        projectTitle: 'Projetos de assistência social',
        accent: 'leaf',
        image: assistenciaSocial,
        imageAlt: 'Voluntários organizando doações para a comunidade',
        summary:
            'Oferecemos apoio para pessoas em vulnerabilidade, promovendo ações de inclusão e desenvolvimento para fortalecer a autonomia e a qualidade de vida da comunidade.',
        description:
            'O Projeto de Assistência Social tem como objetivo apoiar as pessoas em situação de vulnerabilidade, promovendo ações que contribuam para a melhoria da qualidade de vida e o acesso a direitos básicos. Através de programas de orientação, capacitação e suporte material, esse projeto busca fortalecer as redes de apoio e inclusão social, proporcionando uma assistência integral que vai além do auxílio imediato, visando o desenvolvimento de habilidades e a autonomia dos beneficiados.',
    },
];

/** Busca uma área pelo slug. Devolve `undefined` se não existir. */
export const findArea = (slug) => AREAS.find((area) => area.slug === slug);

/**
 * Variáveis CSS de uma área, para injetar via `style` no elemento.
 * Uso: <div style={areaVars(area)} className="border-l-4 border-[var(--area)]">
 */
/**
 * Cada área recebe os quatro tons do seu acento (color, ink, tint, deep)
 * espalhados por cima da definição. Assim os hexadecimais existem em UM lugar
 * só — `lib/palette.js` — e mudar o verde da assistência social muda junto o
 * card da área, a etiqueta, a serra do topo e a página de Processos do painel.
 */
export const AREAS = AREA_DEFINITIONS.map((area) => ({
    ...area,
    ...PALETTE[area.accent],
}));

export const areaVars = (area) => ({
    '--area': area.color,
    '--area-ink': area.ink,
    '--area-tint': area.tint,
    '--area-deep': area.deep,
});
