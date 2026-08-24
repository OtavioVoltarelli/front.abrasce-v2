import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Aviso de "deu certo" mostrado ao voltar para uma listagem.
 *
 * Como funciona: ao salvar, a tela de formulário navega assim —
 *
 *     navigate('/admin/noticias', { state: { flash: 'Notícia publicada.' } })
 *
 * ...e este componente lê esse `state`. É a forma mais simples de levar uma
 * mensagem de uma tela para outra: sem contexto global, sem biblioteca de
 * notificação, sem estado sobrevivendo onde não devia.
 *
 * Depois de ler, a mensagem é APAGADA do histórico com `replace`. Sem isso, a
 * pessoa navega para outra tela, aperta "voltar", e o aviso "Notícia
 * publicada" reaparece anunciando algo de cinco minutos atrás.
 *
 * ---------------------------------------------------------------------------
 * O PADRÃO USADO AQUI: AJUSTAR ESTADO DURANTE A RENDERIZAÇÃO
 * ---------------------------------------------------------------------------
 * A primeira versão fazia `setMessage(...)` dentro de um `useEffect`, e o
 * ESLint reclamou (`react-hooks/set-state-in-effect`) — com razão: efeito roda
 * DEPOIS de pintar a tela, então haveria um quadro sem o aviso, seguido de uma
 * renderização extra só para colocá-lo.
 *
 * O jeito certo, e recomendado pela documentação do React, é o `if` abaixo:
 * comparar a entrada nova com a última vista e ajustar o estado no meio da
 * renderização. O React percebe, descarta o resultado em andamento e refaz na
 * hora — antes de qualquer pintura. Parece errado, mas é o padrão oficial para
 * "derivar estado de uma prop que mudou".
 *
 * O efeito continua existindo, mas agora só faz uma coisa: mexer no histórico
 * do navegador. Isso é sincronizar com um sistema externo, que é exatamente
 * para o que efeito serve.
 */
export default function FlashMessage() {
    const location = useLocation();
    const navigate = useNavigate();

    const incoming = location.state?.flash ?? null;

    const [message, setMessage] = useState(incoming);
    const [lastSeen, setLastSeen] = useState(incoming);

    if (incoming && incoming !== lastSeen) {
        setLastSeen(incoming);
        setMessage(incoming);
    }

    useEffect(() => {
        if (location.state?.flash) {
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.state, location.pathname, navigate]);

    if (!message) return null;

    return (
        <div
            // `role="status"` faz o leitor de tela anunciar o aviso quando ele
            // surge, sem esperar a pessoa navegar até ali.
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl bg-green-50 p-4 ring-1 ring-green-200"
        >
            <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-green-700 text-white">
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4 12 6 6L20 6" />
                </svg>
            </span>
            <p className="flex-1 text-sm font-semibold text-green-900">{message}</p>
            <button
                type="button"
                onClick={() => setMessage(null)}
                aria-label="Fechar aviso"
                className="-my-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-lg text-green-800 transition-colors hover:bg-green-100"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
