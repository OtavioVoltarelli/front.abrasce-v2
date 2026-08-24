/**
 * Projetos que a ABRASCE mantém, com o município onde acontecem.
 *
 * Vieram dos componentes `All-Projects/*` do site antigo, que tinham só nome,
 * cidade e logo. Aqui ganharam o campo `areas`: a mesma taxonomia usada no
 * resto do site (ver `content/areas.js`). Isso é o que permite mostrar, na
 * página de Projetos, quais projetos atendem cada área — sem duplicar listas.
 *
 * Um projeto pode pertencer a mais de uma área. O "Paiê", por exemplo, aparecia
 * em quatro dos cinco componentes antigos; aqui ele é uma entrada só, com
 * quatro áreas.
 */

import apoioEscolar from '../assets/projects/apoio-escolar.jpeg';
import escolaDeArtes from '../assets/projects/escola-de-artes.jpeg';
import esporteMoratense from '../assets/projects/esporte-moratense.png';
import paie from '../assets/projects/paie.jpeg';
import residenciaInclusiva from '../assets/projects/residencia-inclusiva.jpeg';

export const PROJECTS = [
    {
        slug: 'apoio-escolar',
        name: 'Apoio Escolar',
        city: 'Jaboticabal',
        state: 'SP',
        logo: apoioEscolar,
        areas: ['educacao'],
    },
    {
        slug: 'escola-de-artes',
        name: 'Escola de Artes',
        city: 'Jaboticabal',
        state: 'SP',
        logo: escolaDeArtes,
        areas: ['cultura', 'educacao'],
    },
    {
        slug: 'paie',
        name: 'Paiê',
        city: 'Casa Branca',
        state: 'SP',
        logo: paie,
        areas: ['educacao', 'esporte', 'lazer', 'cultura'],
    },
    {
        slug: 'esporte-moratense',
        name: 'Esporte Moratense',
        city: 'Francisco Morato',
        state: 'SP',
        logo: esporteMoratense,
        areas: ['esporte', 'lazer'],
    },
    {
        slug: 'residencia-inclusiva',
        name: 'Residência Inclusiva',
        city: 'Casa Branca',
        state: 'SP',
        logo: residenciaInclusiva,
        areas: ['assistencia-social'],
    },
];

/** Municípios distintos onde a ABRASCE mantém projetos, em ordem alfabética. */
export const PROJECT_CITIES = [...new Set(PROJECTS.map((p) => p.city))].sort(
    (a, b) => a.localeCompare(b, 'pt-BR')
);

export const projectsByArea = (areaSlug) =>
    PROJECTS.filter((project) => project.areas.includes(areaSlug));
