import { useMutation } from '@tanstack/react-query';
import { candidateService } from '../services/candidateService';
import { fetchAllItems } from '../services/pagination';
import { usePagedQuery } from './usePagedQuery';

/** Envio de uma candidatura (formulário público de Trabalhe conosco). */
export function useCreateCandidate(options) {
    return useMutation({
        mutationFn: (payload) => candidateService.create(payload),
        ...options,
    });
}

/** Baixa o arquivo do currículo (Blob) com o token de login. */
export function useCandidateCv(options) {
    return useMutation({
        mutationFn: (candidateId) => candidateService.getCv(candidateId),
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
export function useCandidateSearch(filters, { enabled = false, pageSize = 20 } = {}) {
    return usePagedQuery({
        queryKey: ['candidates', filters],
        fetchPage: (paging) => candidateService.getPage({ ...filters, ...paging }),
        pageSize,
        enabled,
    });
}

/** Todos os candidatos do filtro, para a planilha — ver `fetchAllContacts`. */
export const fetchAllCandidates = (filters) =>
    fetchAllItems((paging) => candidateService.getPage({ ...filters, ...paging }));
