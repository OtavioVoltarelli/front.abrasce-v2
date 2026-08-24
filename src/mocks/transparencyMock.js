/**
 * Árvore de arquivos da transparência.
 *
 * Formato igual ao devolvido por `GET /api/files/transparency-tree`: uma lista
 * de nós com `id` (o caminho completo do arquivo/pasta), `name` (o rótulo) e
 * `children` (ausente ou vazio quando é arquivo). É o formato que a biblioteca
 * `react-arborist` consome.
 */

import { delay } from './delay';

const folder = (name, path, children) => ({ id: path, name, children });
const file = (name, path) => ({ id: `${path}/${name}`, name });

const unidade = (label, slug) =>
    folder(label, slug, [
        folder('Balanços', `${slug}/balancos`, [
            file('balanco-2025.pdf', `${slug}/balancos`),
            file('balanco-2024.pdf', `${slug}/balancos`),
        ]),
        folder('Certidões', `${slug}/certidoes`, [
            file('cnd-federal.pdf', `${slug}/certidoes`),
            file('cnd-municipal.pdf', `${slug}/certidoes`),
            file('crf-fgts.pdf', `${slug}/certidoes`),
        ]),
        folder('Relatórios de atividades', `${slug}/relatorios`, [
            file('relatorio-anual-2025.pdf', `${slug}/relatorios`),
        ]),
        folder('Contratos e termos de fomento', `${slug}/contratos`, [
            file('termo-de-fomento-001.pdf', `${slug}/contratos`),
        ]),
    ]);

const TREE = [
    folder('Sede — ABRASCE Social', 'sedeabrasce', [
        folder('Estatuto', 'sedeabrasce/estatuto', [
            file('estatuto-social.pdf', 'sedeabrasce/estatuto'),
        ]),
        folder('Atas', 'sedeabrasce/atas', [
            file('ata-assembleia-2026.pdf', 'sedeabrasce/atas'),
            file('ata-assembleia-2025.pdf', 'sedeabrasce/atas'),
        ]),
        folder('Balanços', 'sedeabrasce/balancos', [
            file('balanco-2025.pdf', 'sedeabrasce/balancos'),
            file('balanco-2024.pdf', 'sedeabrasce/balancos'),
            file('balanco-2023.pdf', 'sedeabrasce/balancos'),
        ]),
        folder('Certidões', 'sedeabrasce/certidoes', [
            file('cnd-federal.pdf', 'sedeabrasce/certidoes'),
            file('cnd-estadual.pdf', 'sedeabrasce/certidoes'),
            file('cnd-municipal.pdf', 'sedeabrasce/certidoes'),
            file('crf-fgts.pdf', 'sedeabrasce/certidoes'),
        ]),
        folder('Regulamentos', 'sedeabrasce/regulamentos', [
            file('regulamento-de-compras.pdf', 'sedeabrasce/regulamentos'),
            file('regulamento-de-pessoal.pdf', 'sedeabrasce/regulamentos'),
        ]),
        folder('Relatórios', 'sedeabrasce/relatorios', [
            file('relatorio-anual-2025.pdf', 'sedeabrasce/relatorios'),
            file('relatorio-anual-2024.pdf', 'sedeabrasce/relatorios'),
        ]),
        folder('Outros documentos', 'sedeabrasce/outrosdocumentos', [
            file('lista-de-parceiros.pdf', 'sedeabrasce/outrosdocumentos'),
        ]),
    ]),
    unidade('Casa Branca', 'casabranca'),
    unidade('Jaboticabal', 'jaboticabal'),
    unidade('Francisco Morato', 'franciscomorato'),
    unidade('Guarujá', 'guaruja'),
    unidade('São Vicente', 'saovicente'),
    unidade('Tuiuti', 'tuiuti'),
];

export const transparencyMockService = {
    getTree: async () => {
        await delay();
        return structuredClone(TREE);
    },
};
