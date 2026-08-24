import Button from '../ui/Button';

/**
 * Tela de erro.
 *
 * Regra de escrita: erro não pede desculpas e não é vago. Ele diz o que
 * aconteceu e o que a pessoa pode fazer agora. "Ops! Algo deu errado :(" não
 * ajuda ninguém a decidir se recarrega, se espera ou se liga para alguém.
 *
 * A mensagem técnica aparece em letra pequena, embaixo — inútil para a maioria,
 * mas é o que salva quando a ABRASCE liga dizendo "não abre".
 */
export default function ErrorState({ title = 'Não foi possível carregar', description, error, onRetry }) {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50/70 px-6 py-12 text-center">
            <span aria-hidden="true" className="mb-4 grid size-14 place-items-center rounded-2xl bg-white text-red-600 shadow-card">
                <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 8v5M12 17h.01" />
                    <circle cx="12" cy="12" r="9" />
                </svg>
            </span>

            <h3 className="text-lg text-ink-900">{title}</h3>
            <p className="mt-2 max-w-md text-sm text-ink-800">
                {description ?? 'Verifique sua conexão com a internet e tente novamente.'}
            </p>

            {error?.message && (
                <p className="mt-3 max-w-md text-xs text-muted">Detalhe técnico: {error.message}</p>
            )}

            {onRetry && (
                <Button variant="secondary" onClick={onRetry} className="mt-6">
                    Tentar novamente
                </Button>
            )}
        </div>
    );
}
