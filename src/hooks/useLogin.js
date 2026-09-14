import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

/**
 * Mutação de login. Só faz a chamada de rede — quem GUARDA o resultado (o
 * token, no localStorage) é o `AuthContext`, chamado no `onSuccess` de quem
 * usa este hook (`pages/Login`). A mesma fronteira do resto do projeto: hook
 * de React Query cuida de rede, Context cuida de estado global.
 */
export function useLogin() {
    return useMutation({
        mutationFn: ({ email, password }) => authService.login(email, password),
    });
}
