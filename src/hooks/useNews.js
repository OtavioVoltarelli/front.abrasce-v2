import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../services/newsService';
import { usePagedQuery } from './usePagedQuery';

/**
 * O fluxo de dados do projeto é: service (HTTP/mock) -> hook (React Query) ->
 * componente. O componente nunca chama axios direto.
 *
 * `queryKey` é o endereço do dado no cache. Duas telas que pedem
 * ['news','latest',6] recebem a MESMA resposta, sem uma segunda requisição.
 */
const NEWS_KEY = ['news'];

/* -------------------------------------------------------------------- leitura */

export function useLatestNews(quantity = 6) {
    return useQuery({
        queryKey: [...NEWS_KEY, 'latest', quantity],
        queryFn: () => newsService.getLatest(quantity),
    });
}

/**
 * Listagem paginada. `pageSize` varia por tela: a página pública usa 12
 * (múltiplo de 2 e 3, as colunas da grade), o painel usa 20.
 */
export function useNewsPages({ pageSize }) {
    return usePagedQuery({
        queryKey: [...NEWS_KEY, 'list'],
        fetchPage: newsService.getPage,
        pageSize,
    });
}

/**
 * Só o total de notícias, para o contador do Dashboard. Pede uma página de
 * UM item e lê `totalElements`: o banco conta, e a rede só carrega uma
 * notícia em vez de todas.
 */
export function useNewsTotal() {
    return useQuery({
        queryKey: [...NEWS_KEY, 'total'],
        queryFn: () => newsService.getPage({ page: 0, size: 1 }).then((page) => page.totalElements),
    });
}

export function useNewsById(id) {
    return useQuery({
        queryKey: [...NEWS_KEY, 'detail', String(id)],
        // `enabled` impede a busca enquanto o id não existe — sem isso o React
        // Query dispararia uma requisição para "/news/undefined" no primeiro
        // render, antes de a rota resolver o parâmetro.
        enabled: Boolean(id),
        queryFn: () => newsService.getById(id),
    });
}

/* -------------------------------------------------------------------- escrita */

/**
 * `invalidateQueries({ queryKey: ['news'] })` marca como desatualizado TUDO
 * que começa com 'news' — a listagem do admin, a lista pública e a home.
 * O React Query rebusca sozinho o que estiver na tela naquele momento.
 *
 * É isso que dispensa o "recarregar na mão" depois de salvar. Repare que a
 * chave é o prefixo, não a chave exata: usar `['news','all']` deixaria a home
 * mostrando a notícia antiga até alguém recarregar a página.
 */
export function useCreateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => newsService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_KEY }),
    });
}

export function useUpdateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => newsService.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_KEY }),
    });
}

export function useDeleteNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => newsService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_KEY }),
    });
}
