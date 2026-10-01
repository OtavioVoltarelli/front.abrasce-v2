import { useMutation } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { fetchAllItems } from '../services/pagination';
import { usePagedQuery } from './usePagedQuery';

/**
 * Envio do formulário de contato (site público).
 *
 * `useMutation` (e não `useQuery`) porque isto ESCREVE algo no servidor.
 * A diferença prática: uma query roda sozinha ao montar a tela e pode ser
 * repetida à vontade; uma mutation só roda quando você manda, e o React Query
 * não a repete sozinha — enviar o mesmo contato duas vezes seria um bug.
 */
export function useSendContact(options) {
    return useMutation({
        mutationFn: (payload) => contactService.send(payload),
        ...options,
    });
}

/**
 * Listagem de contatos no painel.
 *
 * `enabled: false` por padrão: a tela só busca quando a pessoa clica em
 * "Buscar". Sem isso, a lista carregaria sozinha ao abrir a página, ignorando
 * os filtros — que é justamente o que a tela quer evitar.
 *
 * `filters` (startDate/finalDate) entra na `queryKey` — igual a
 * `useCandidateSearch` — para que mudar o período dispare uma busca nova em
 * vez de reaproveitar o cache de outro intervalo.
 */
export function useContactSearch(filters, { enabled = false, pageSize = 20 } = {}) {
    return usePagedQuery({
        queryKey: ['contacts', filters],
        fetchPage: (paging) => contactService.getPage({ ...filters, ...paging }),
        pageSize,
        enabled,
    });
}

/**
 * Todos os contatos do período, para a planilha. É uma função, não um hook:
 * roda só no clique de "Exportar", e a planilha precisa do período INTEIRO,
 * não só das páginas que a pessoa abriu na tela.
 */
export const fetchAllContacts = (filters) =>
    fetchAllItems((paging) => contactService.getPage({ ...filters, ...paging }));
