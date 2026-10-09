import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reusableFileService } from '../services/reusableFileService';
import { usePagedQuery } from './usePagedQuery';

const FILES_KEY = ['reusable-files'];
const NEWS_KEY = ['news'];

/* -------------------------------------------------------------------- leitura */

/**
 * Página da biblioteca, já filtrada NO SERVIDOR por nome e tipo.
 *
 * `search` e `kind` entram na `queryKey`: cada combinação é um cache próprio.
 * Voltar para "Todos" depois de filtrar por "PDFs" mostra na hora o que já
 * tinha sido carregado, sem nova requisição.
 *
 * Quem chama deve passar o termo de busca já "adiado" (`useDebouncedValue`);
 * do contrário, cada tecla vira uma requisição.
 */
export function useReusableFilePages({ search = '', kind = 'all', pageSize }) {
    const filters = { search: search.trim(), kind };
    return usePagedQuery({
        queryKey: [...FILES_KEY, 'list', filters],
        fetchPage: (paging) => reusableFileService.getPage({ ...filters, ...paging }),
        pageSize,
        keepPrevious: true,
    });
}

/** Total da biblioteca, para o Dashboard — mesma técnica de `useNewsTotal`. */
export function useReusableFileTotal() {
    return useQuery({
        queryKey: [...FILES_KEY, 'total'],
        queryFn: () =>
            reusableFileService.getPage({ page: 0, size: 1 }).then((page) => page.totalElements),
    });
}

/**
 * QUEM usa um arquivo — a gaveta mostra a lista para explicar por que a
 * exclusão está travada. O card não precisa disto: o número já vem em
 * `usageCount`, junto com o arquivo.
 *
 * Paginado porque uma capa padrão pode estar em centenas de notícias.
 */
export function useFileUsages(fileId, { pageSize = 10 } = {}) {
    return usePagedQuery({
        queryKey: [...FILES_KEY, 'usages', fileId],
        fetchPage: (paging) => reusableFileService.getUsagesPage(fileId, paging),
        pageSize,
        enabled: Boolean(fileId),
    });
}

/** Baixa o arquivo (Blob) com o token de login, para salvar com o nome original. */
export const useDownloadReusableFile = () =>
    useMutation({ mutationFn: (id) => reusableFileService.download(id) });

/* -------------------------------------------------------------------- escrita */

/**
 * Toda escrita invalida DUAS chaves: a da biblioteca e a de notícias.
 *
 * A de notícias não é exagero. O `NewsOutput` traz o `coverImage` inteiro
 * embutido — nome incluído. Renomear "Capa padrão" para "Capa institucional"
 * muda o que a listagem de notícias mostra, e sem invalidar a chave de
 * notícias o painel continuaria exibindo o nome antigo até alguém recarregar
 * a página. É o preço de o backend embutir o objeto em vez de só o id, e a
 * conta se paga aqui, num lugar só.
 */
function useFileMutation(mutationFn) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FILES_KEY });
            queryClient.invalidateQueries({ queryKey: NEWS_KEY });
        },
    });
}

export const useCreateReusableFile = () =>
    useFileMutation((payload) => reusableFileService.create(payload));

export const useRenameReusableFile = () =>
    useFileMutation(({ id, name }) => reusableFileService.rename(id, { name }));

export const useReplaceReusableFile = () =>
    useFileMutation(({ id, file }) => reusableFileService.replaceFile(id, file));

export const useDeleteReusableFile = () =>
    useFileMutation((id) => reusableFileService.remove(id));
