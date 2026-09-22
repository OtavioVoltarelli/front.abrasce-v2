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

let TREE = [
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

/**
 * Administração da árvore — cria, renomeia, move e exclui pasta/arquivo.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ISTO É MAIS QUE UM CRUD DE LISTA
 * ---------------------------------------------------------------------------
 * O backend de verdade (`FileService.java`) guarda isto como pastas e arquivos
 * NO DISCO — `id` de cada nó é o caminho relativo completo, e o caminho de um
 * filho sempre é `${id do pai}/${nome do filho}`. Renomear ou mover uma PASTA
 * muda o caminho dela e, por tabela, o de tudo que existe dentro — exatamente
 * como mover uma pasta de verdade no sistema de arquivos. `rebase()` reproduz
 * isso: recalcula o `id` de um nó e de toda a sua descendência a partir de um
 * novo caminho-base, sem tocar em nome nenhum.
 *
 * Isto importa pra tela ficar HONESTA em modo mock: se ela buscasse o
 * `id` antigo depois de um "mover", teria voltado uma pasta vazia — igual ao
 * que aconteceria contra o backend real se ele não fizesse essa mesma conta.
 */
const isFolder = (node) => Array.isArray(node.children);

const joinPath = (parentId, name) => (parentId ? `${parentId}/${name}` : name);

const parentIdOf = (path) => {
    const slash = path.lastIndexOf('/');
    return slash === -1 ? null : path.slice(0, slash);
};

/** Acha o nó e o array (children do pai, ou a raiz) que o contém. */
function locate(nodes, id) {
    for (const node of nodes) {
        if (node.id === id) return { node, siblings: nodes };
        if (isFolder(node)) {
            const found = locate(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

function rebase(node, newId) {
    const updated = { ...node, id: newId };
    if (isFolder(node)) {
        updated.children = node.children.map((child) => rebase(child, joinPath(newId, child.name)));
    }
    return updated;
}

/** Insere um nó no array de destino, substituindo quem já ocupava o mesmo
 *  nome — é o mesmo `REPLACE_EXISTING` que o backend usa em upload/mover. */
function upsert(siblings, node) {
    const withoutSameName = siblings.filter((sibling) => sibling.name !== node.name);
    return [...withoutSameName, node];
}

export const transparencyAdminMockService = {
    upload: async (file, path) => {
        await delay(700);
        const folderId = path || null;
        const node = { id: joinPath(folderId, file.name), name: file.name };
        TREE = folderId === null
            ? upsert(TREE, node)
            : replaceChildren(TREE, folderId, (siblings) => upsert(siblings, node));
    },

    createFolder: async (path) => {
        await delay(500);
        const parentId = parentIdOf(path);
        const name = path.slice((parentId?.length ?? -1) + 1);
        const node = { id: path, name, children: [] };
        TREE = parentId === null
            ? upsert(TREE, node)
            : replaceChildren(TREE, parentId, (siblings) => upsert(siblings, node));
    },

    rename: async (path, name) => {
        await delay(500);
        const parentId = parentIdOf(path);
        const newId = joinPath(parentId, name);
        TREE = replaceNode(TREE, path, (node) => rebase({ ...node, name }, newId));
    },

    move: async (from, to) => {
        await delay(600);
        const found = locate(TREE, from);
        if (!found) return;
        const rebased = rebase(found.node, to);
        const withoutSource = removeNode(TREE, from);
        const destinationFolderId = parentIdOf(to);
        TREE = destinationFolderId === null
            ? upsert(withoutSource, rebased)
            : replaceChildren(withoutSource, destinationFolderId, (siblings) => upsert(siblings, rebased));
    },

    remove: async (path) => {
        await delay(500);
        TREE = removeNode(TREE, path);
    },
};

/** As três funções abaixo devolvem uma ÁRVORE NOVA (nunca mutam `TREE` no
 *  lugar) pelo mesmo motivo dos outros mocks: o React Query guarda a última
 *  resposta em cache, e mutar aquele objeto por baixo seria um bug bem
 *  disfarçado — a tela mudaria sem re-renderizar, ou renderizaria dados que
 *  ninguém "buscou" de fato. */
function replaceChildren(nodes, folderId, updateChildren) {
    return nodes.map((node) => {
        if (node.id === folderId && isFolder(node)) {
            return { ...node, children: updateChildren(node.children) };
        }
        if (isFolder(node)) {
            return { ...node, children: replaceChildren(node.children, folderId, updateChildren) };
        }
        return node;
    });
}

function replaceNode(nodes, id, update) {
    return nodes.map((node) => {
        if (node.id === id) return update(node);
        if (isFolder(node)) return { ...node, children: replaceNode(node.children, id, update) };
        return node;
    });
}

function removeNode(nodes, id) {
    return nodes
        .filter((node) => node.id !== id)
        .map((node) => (isFolder(node) ? { ...node, children: removeNode(node.children, id) } : node));
}
