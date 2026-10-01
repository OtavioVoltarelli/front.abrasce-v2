import { useMemo } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

/**
 * Lista paginada com "Carregar mais".
 *
 * `useInfiniteQuery` guarda as páginas já buscadas numa lista (`data.pages`) e
 * sabe pedir a próxima (`fetchNextPage`). Este hook esconde esse formato:
 * a tela recebe `data` como um array só, com todos os itens carregados até
 * agora — igual a um `useQuery` comum. Por isso `QueryBoundary` funciona sem
 * mudar nada.
 *
 * `fetchPage` recebe `{ page, size }` e devolve `{ items, page, totalPages,
 * totalElements }` (ver `services/pagination.js`).
 *
 * `keepPrevious`: ao trocar a `queryKey` (uma busca nova, outro filtro), a
 * lista antiga continua na tela até a nova chegar, em vez de voltar ao
 * esqueleto a cada letra digitada. `isPlaceholderData` diz que o que está na
 * tela é o resultado anterior, para a tela sinalizar que está atualizando.
 *
 * Devolve um objeto montado à mão em vez de espalhar (`...query`) o resultado
 * do React Query. O resultado dele só re-renderiza a tela quando muda uma
 * propriedade que a tela LEU; espalhar lê todas e desliga essa economia.
 */
export function usePagedQuery({ queryKey, fetchPage, pageSize, enabled = true, keepPrevious = false }) {
    const query = useInfiniteQuery({
        queryKey: [...queryKey, { pageSize }],
        queryFn: ({ pageParam }) => fetchPage({ page: pageParam, size: pageSize }),
        initialPageParam: 0,
        getNextPageParam: (last) => (last.page + 1 < last.totalPages ? last.page + 1 : undefined),
        enabled,
        placeholderData: keepPrevious ? keepPreviousData : undefined,
    });

    const pages = query.data?.pages;
    const items = useMemo(() => pages?.flatMap((page) => page.items), [pages]);

    return {
        data: items,
        totalElements: pages?.[0]?.totalElements ?? 0,
        isPending: query.isPending,
        // Se só a PRÓXIMA página falhar, o React Query marca a consulta inteira
        // como erro. A tela trocaria 40 itens já carregados por "algo deu
        // errado". Aqui essa falha fica só no botão (`isFetchNextPageError`).
        isSuccess: query.isSuccess || query.isFetchNextPageError,
        isError: query.isError && !query.isFetchNextPageError,
        error: query.error,
        isFetching: query.isFetching,
        isPlaceholderData: query.isPlaceholderData,
        refetch: query.refetch,
        hasNextPage: query.hasNextPage,
        fetchNextPage: query.fetchNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isFetchNextPageError: query.isFetchNextPageError,
    };
}
