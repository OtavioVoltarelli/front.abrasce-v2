import { useQuery } from '@tanstack/react-query';
import { transparencyService } from '../services/transparencyService';

export function useTransparencyTree() {
    return useQuery({
        queryKey: ['transparency', 'tree'],
        queryFn: () => transparencyService.getTree(),
        // A árvore de documentos muda raramente. 5 minutos sem rebuscar evita
        // uma requisição a cada vez que a pessoa volta para a aba.
        staleTime: 5 * 60 * 1000,
    });
}
