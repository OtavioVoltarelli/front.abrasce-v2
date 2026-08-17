import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruitmentProcessService } from "../services/recruitmentProcessService";

const RP_KEY = ["recruitmentProcesses"];

/* -------------------------------------------------------------------- leitura */

export function useActivesRecruitmentProcesses() {
    return useQuery({
        queryKey: [...RP_KEY, "actives"],
        queryFn: recruitmentProcessService.getActivesRecruitmentProcesses,
    });
}

export function useRecruitmentProcessById(id) {
    return useQuery({
        queryKey: [...RP_KEY, "detail", id],
        queryFn: () => recruitmentProcessService.getRecruitmentProcessById(id),
        enabled: Boolean(id),
    });
}

/** Listagem completa (ativos e inativos) da área restrita. */
export function useAllRecruitmentProcesses() {
    return useQuery({
        queryKey: [...RP_KEY, "all"],
        queryFn: recruitmentProcessService.getAllRecruitmentProcesses,
    });
}

/* -------------------------------------------------------------------- escrita */

export function useCreateRecruitmentProcess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => recruitmentProcessService.createRecruitmentProcess(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RP_KEY }),
    });
}

export function useUpdateRecruitmentProcess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => recruitmentProcessService.updateRecruitmentProcess(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RP_KEY }),
    });
}

export function useDeleteRecruitmentProcess() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => recruitmentProcessService.deleteRecruitmentProcess(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: RP_KEY }),
    });
}
