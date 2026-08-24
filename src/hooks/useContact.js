import { useMutation, useQuery } from '@tanstack/react-query';
import { contactService } from '../services/contactService';

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
 */
export function useContactSearch({ enabled = false } = {}) {
    return useQuery({
        queryKey: ['contacts', 'all'],
        queryFn: () => contactService.getAll(),
        enabled,
    });
}
