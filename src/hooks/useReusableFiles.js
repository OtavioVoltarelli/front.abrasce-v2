import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reusableFileService } from '../services/reusableFileService';
import { fileKind } from '../lib/fileKind';
import { useAllNews } from './useNews';

const FILES_KEY = ['reusable-files'];
const NEWS_KEY = ['news'];

/* -------------------------------------------------------------------- leitura */

export function useReusableFiles() {
    return useQuery({
        queryKey: [...FILES_KEY, 'all'],
        queryFn: () => reusableFileService.getAll(),
    });
}

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

/* ------------------------------------------------------------------ derivados */

/**
 * Onde cada arquivo está sendo usado.
 *
 * O backend sabe disso (`existsByCoverImageId`), mas só usa a informação para
 * RECUSAR o DELETE — não existe endpoint que responda "quem usa o arquivo 7?".
 * Como a lista completa de notícias já está no cache do React Query (a tela de
 * Notícias a carrega), dá para cruzar as duas aqui sem nenhuma requisição
 * extra.
 *
 * Isso é o que permite avisar ANTES do clique, em vez de deixar a pessoa
 * tentar excluir e levar um erro. Quando o backend expuser a contagem, este
 * hook troca o `useMemo` por um `useQuery` e nada mais muda.
 */
export function useFileUsage() {
    const news = useAllNews();

    const usageByFileId = useMemo(() => {
        const map = new Map();
        for (const item of news.data ?? []) {
            const fileId = item.coverImage?.id;
            if (!fileId) continue;
            const list = map.get(fileId) ?? [];
            list.push({ id: item.id, title: item.title, section: 'Notícia' });
            map.set(fileId, list);
        }
        return map;
    }, [news.data]);

    return {
        usageByFileId,
        /* Enquanto as notícias não chegaram, NÃO sabemos se o arquivo está em
           uso. Devolver "não está" seria mentir e liberaria uma exclusão que o
           servidor recusaria. A tela usa isto para desabilitar o botão. */
        isPending: news.isPending,
        isError: news.isError,
        usageOf: (fileId) => usageByFileId.get(fileId) ?? [],
    };
}

/**
 * Busca por nome e filtro por tipo, no navegador.
 *
 * Fica isolado num hook de propósito: hoje `GET /api/reusable-files` devolve a
 * lista inteira e filtrar aqui é o certo (zero requisição, resposta instantânea
 * a cada tecla). Quando a biblioteca crescer e o backend ganhar
 * `?search=&type=`, este é o único arquivo que muda — a tela continua
 * chamando `useFilteredFiles` e não sabe de onde vem o filtro.
 *
 * A busca olha os TRÊS nomes: o rótulo da biblioteca, o nome original do
 * arquivo e — por tabela — a extensão. Quem subiu o arquivo lembra de um dos
 * dois, e não necessariamente do que digitou no rótulo.
 */
export function useFilteredFiles(files, { search = '', kind = 'all' } = {}) {
    return useMemo(() => {
        const term = search.trim().toLowerCase();
        return (files ?? []).filter((file) => {
            if (kind !== 'all' && fileKind(file).id !== kind) return false;
            if (!term) return true;
            return (
                file.name?.toLowerCase().includes(term) ||
                file.originalName?.toLowerCase().includes(term)
            );
        });
    }, [files, search, kind]);
}
