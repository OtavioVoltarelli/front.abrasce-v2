import { useMutation, useQuery } from '@tanstack/react-query';
import { candidateService } from '../services/candidateService';

/** Envio de uma candidatura (formulário público de Trabalhe conosco). */
export function useCreateCandidate(options) {
    return useMutation({
        mutationFn: (payload) => candidateService.create(payload),
        ...options,
    });
}

/**
 * Busca de candidatos no painel administrativo.
 *
 * `enabled: false` por padrão: a tela só busca quando a pessoa clica em
 * "Buscar". Sem isso, a listagem carregaria sozinha ao abrir a página, sem
 * filtro nenhum — que é justamente o que a tela quer evitar.
 */
export function useCandidateSearch(filters, { enabled = false } = {}) {
    return useQuery({
        queryKey: ['candidates', filters],
        queryFn: () => candidateService.findByFilter(filters),
        enabled,
    });
}
