import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../services/newsService';

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

export function useAllNews() {
    return useQuery({
        queryKey: [...NEWS_KEY, 'all'],
        queryFn: () => newsService.getAll(),
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
