import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transparencyService } from '../services/transparencyService';
import { transparencyAdminService } from '../services/transparencyAdminService';

const TREE_KEY = ['transparency', 'tree'];

/* -------------------------------------------------------------------- leitura */

export function useTransparencyTree() {
    return useQuery({
        queryKey: TREE_KEY,
        queryFn: () => transparencyService.getTree(),
        // A árvore de documentos muda raramente. 5 minutos sem rebuscar evita
        // uma requisição a cada vez que a pessoa volta para a aba.
        staleTime: 5 * 60 * 1000,
    });
}

/** Um nó é pasta quando tem `children` (mesmo vazio); arquivo, quando não tem. */
export const isFolderNode = (node) => Array.isArray(node.children);

/**
 * Quantos itens existem dentro de uma pasta, contando TODOS os níveis —
 * não só os filhos diretos. Existe por causa de um teste contra o backend
 * real: a árvore de transparência tem 1832 nós no ambiente local, e uma
 * pasta de topo como "casabranca" tem só um punhado de filhos diretos
 * escondendo centenas de arquivos por baixo. O aviso de exclusão (`FileService
 * .deleteTransparencyPath` apaga recursivamente) precisa do número de
 * verdade — contar só os filhos diretos subestimaria uma ação que não dá
 * para desfazer.
 */
export const countDescendants = (node) => {
    if (!isFolderNode(node)) return 0;
    return node.children.reduce((total, child) => total + 1 + countDescendants(child), 0);
};

/** `candidateId` é o próprio `ancestorId`, ou vive dentro dele. Usado para
 *  impedir mover uma pasta para dentro de si mesma ou de uma pasta filha —
 *  o backend faz essa operação de verdade no disco, e "mover uma pasta para
 *  dentro dela mesma" quebra ali, não só na tela. */
export const isSameOrDescendant = (ancestorId, candidateId) =>
    candidateId === ancestorId || candidateId.startsWith(`${ancestorId}/`);

/** Caminho de um item dentro da pasta `parentId` (`null` = raiz). Mesma conta
 *  em três lugares: criar pasta, subir arquivo e mover — todos pedem ao
 *  backend um caminho completo, nunca só um nome solto. */
export const joinPath = (parentId, name) => (parentId ? `${parentId}/${name}` : name);

/**
 * Mensagem de erro para um nome digitado (nova pasta, renomear), ou `null` se
 * ele serve. Espelha o backend (`FileService.validateTransparencyName`):
 * · barra criaria uma subpasta (ou o backend cortaria o nome nela) em vez de
 *   dar o nome pedido;
 * · `%` e `;` deixam o item impossível de abrir — o servidor recusa a URL.
 * Validar aqui avisa enquanto a pessoa digita, em vez de depois de enviar.
 */
export function nameProblem(name) {
    const trimmed = name.trim();
    if (!trimmed) return 'O nome não pode ficar em branco.';
    if (trimmed === '.' || trimmed === '..') return 'Escolha outro nome.';
    if (/[/\\]/.test(trimmed)) return 'O nome não pode ter barra (/ ou \\).';
    if (/[%;]/.test(trimmed)) return 'O nome não pode ter os caracteres % ou ;.';
    return null;
}

/** Já existe um item com este nome na lista? Sem diferenciar maiúsculas — "Balanço.pdf" e "balanço.pdf" lado a lado só confundem. */
export const hasNameIn = (names, candidate) =>
    names.some((existing) => existing.toLowerCase() === candidate.toLowerCase());

/** Pasta que contém `id` — `null` quando `id` já está na raiz. Inverso de `joinPath`. */
export const parentIdOf = (id) => {
    const slash = id.lastIndexOf('/');
    return slash === -1 ? null : id.slice(0, slash);
};

/* -------------------------------------------------------------------- escrita */

function useTransparencyMutation(mutationFn) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: TREE_KEY }),
    });
}

export const useUploadTransparencyFile = () =>
    useTransparencyMutation(({ file, path }) => transparencyAdminService.upload(file, path));

export const useCreateTransparencyFolder = () =>
    useTransparencyMutation((path) => transparencyAdminService.createFolder(path));

export const useRenameTransparencyPath = () =>
    useTransparencyMutation(({ path, name }) => transparencyAdminService.rename(path, name));

export const useMoveTransparencyPath = () =>
    useTransparencyMutation(({ from, to }) => transparencyAdminService.move(from, to));

export const useDeleteTransparencyPath = () =>
    useTransparencyMutation((path) => transparencyAdminService.remove(path));

/* ------------------------------------------------------------------ navegação */

/**
 * Estado de "em qual pasta estou": pasta por pasta, como um app de arquivos
 * de celular — não uma árvore inteira aberta na tela. Ver a conversa que
 * decidiu isto: uma árvore editável (arrastar para mover, indentação
 * profunda) é o tipo de interface que só funciona bem com mouse.
 *
 * `path` guarda só os IDS das pastas visitadas, nunca os nós inteiros. Se
 * guardasse os nós, eles ficariam PARADOS no que a árvore era no momento da
 * navegação — depois de criar um arquivo na pasta atual, por exemplo, a tela
 * mostraria a pasta desatualizada até a pessoa sair e voltar. Com só o id,
 * cada render busca os filhos de novo na árvore mais recente (`index`).
 */
export function useTransparencyBrowser(tree) {
    const [path, setPath] = useState([]);

    const index = useMemo(() => {
        const map = new Map();
        const walk = (nodes) => {
            for (const node of nodes) {
                map.set(node.id, node);
                if (isFolderNode(node)) walk(node.children);
            }
        };
        walk(tree ?? []);
        return map;
    }, [tree]);

    const currentFolderId = path.length > 0 ? path[path.length - 1] : null;

    const items = useMemo(() => {
        const list = currentFolderId === null ? (tree ?? []) : (index.get(currentFolderId)?.children ?? []);
        // Pastas primeiro, depois arquivos — cada grupo na ordem que veio do
        // backend. É a convenção que qualquer gerenciador de arquivos usa.
        return [...list.filter(isFolderNode), ...list.filter((item) => !isFolderNode(item))];
    }, [tree, index, currentFolderId]);

    const crumbs = useMemo(
        () => [{ id: null, name: 'Documentos' }, ...path.map((id) => ({ id, name: index.get(id)?.name ?? '—' }))],
        [path, index]
    );

    return {
        currentFolderId,
        items,
        crumbs,
        /** Entra numa subpasta — chamar só com o id de uma pasta presente em `items`. */
        enter: (folderId) => setPath((current) => [...current, folderId]),
        /** Pula para um nível da trilha (`crumbs[i]`): 0 volta pra raiz. */
        goTo: (crumbIndex) => setPath((current) => current.slice(0, crumbIndex)),
    };
}
