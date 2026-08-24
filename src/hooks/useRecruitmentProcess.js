import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recruitmentProcessService } from '../services/recruitmentProcessService';

const RP_KEY = ['recruitmentProcesses'];

/* -------------------------------------------------------------------- leitura */

/** Só os processos abertos — é o que o site público mostra. */
export function useActiveRecruitmentProcesses() {
    return useQuery({
        queryKey: [...RP_KEY, 'actives'],
        queryFn: () => recruitmentProcessService.getActives(),
    });
}

/** Ativos e encerrados — usado no painel administrativo. */
export function useAllRecruitmentProcesses() {
    return useQuery({
        queryKey: [...RP_KEY, 'all'],
        queryFn: () => recruitmentProcessService.getAll(),
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
