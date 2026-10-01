import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recruitmentProcessService } from '../services/recruitmentProcessService';
import { fetchAllItems } from '../services/pagination';
import { usePagedQuery } from './usePagedQuery';

const RP_KEY = ['recruitmentProcesses'];

/* -------------------------------------------------------------------- leitura */

/** Só os processos abertos — é o que o site público mostra. */
export function useActiveRecruitmentProcessPages({ pageSize }) {
    return usePagedQuery({
        queryKey: [...RP_KEY, 'actives'],
        fetchPage: recruitmentProcessService.getActivesPage,
        pageSize,
    });
}

/** Ativos e encerrados — listagem do painel. */
export function useRecruitmentProcessPages({ pageSize }) {
    return usePagedQuery({
        queryKey: [...RP_KEY, 'list'],
        fetchPage: recruitmentProcessService.getPage,
        pageSize,
    });
}

/**
 * Quantos processos estão abertos (contador do Dashboard e da listagem).
 * Página de um item só, lendo `totalElements` — o banco conta.
 */
export function useActiveRecruitmentProcessTotal() {
    return useQuery({
        queryKey: [...RP_KEY, 'actives', 'total'],
        queryFn: () =>
            recruitmentProcessService
                .getActivesPage({ page: 0, size: 1 })
                .then((page) => page.totalElements),
    });
}

/**
 * TODOS os processos, para o <select> da tela de candidatos.
 *
 * Aqui "todos" é o requisito de verdade: um select paginado esconderia o
 * processo que a pessoa procura. Processo seletivo é um cadastro pequeno
 * (dezenas por ano), então percorrer as páginas é barato.
 */
export function useRecruitmentProcessOptions() {
    return useQuery({
        queryKey: [...RP_KEY, 'options'],
        queryFn: () => fetchAllItems(recruitmentProcessService.getPage),
    });
}

export function useRecruitmentProcessById(id) {
    return useQuery({
        queryKey: [...RP_KEY, 'detail', String(id)],
        enabled: Boolean(id),
        queryFn: () => recruitmentProcessService.getById(id),
    });
}

/* -------------------------------------------------------------------- escrita */

export function useCreateRecruitmentProcess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => recruitmentProcessService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RP_KEY }),
    });
}

export function useUpdateRecruitmentProcess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => recruitmentProcessService.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RP_KEY }),
    });
}

export function useDeleteRecruitmentProcess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => recruitmentProcessService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RP_KEY }),
    });
}
