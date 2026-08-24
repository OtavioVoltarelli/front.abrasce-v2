import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

/**
 * Configuração global do React Query.
 *
 * `staleTime: 60s` — durante um minuto, um dado já buscado é considerado
 * fresco e não é buscado de novo. Sem isso, o padrão é rebuscar toda vez que a
 * pessoa volta para a aba do navegador. Em celular, cada uma dessas buscas é
 * bateria e dados móveis gastos para receber exatamente o mesmo conteúdo.
 *
 * `retry: 1` — uma tentativa a mais em caso de falha, não três. Três tentativas
 * com espera crescente deixam a pessoa ~10 segundos olhando para o spinner
 * antes de ver a mensagem de erro. Melhor falhar rápido e oferecer "tentar
 * novamente", que é o que a tela de erro faz.
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </StrictMode>
);
