import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newsService } from "../services/newsService";

/**
 * Chave de cache das listagens de notícia.
 * Toda escrita invalida esta chave — o React Query então rebusca sozinho
 * o que estiver na tela. É o que dispensa o "refetch na mão" do v1.
 */
const NEWS_KEY = ["news"];

/* -------------------------------------------------------------------- leitura */

export function useNewsList(quantity) {
    return useQuery({
        queryKey: [...NEWS_KEY, "top", quantity],
        queryFn: () => newsService.getTopNews(quantity),
    });
}

export function useNewsById(id) {
    return useQuery({
        queryKey: [...NEWS_KEY, "detail", id],
        queryFn: () => newsService.getNewsById(id),
        enabled: Boolean(id),
    });
}

/** Listagem completa da área restrita. */
export function useAllNews() {
    return useQuery({
        queryKey: [...NEWS_KEY, "all"],
        queryFn: newsService.getAllNews,
    });
}

/* -------------------------------------------------------------------- escrita */

export function useCreateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => newsService.createNews(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_KEY }),
    });
}

export function useUpdateNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => newsService.updateNews(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_KEY }),
    });
}

export function useDeleteNews() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => newsService.deleteNews(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: NEWS_KEY }),
    });
}
