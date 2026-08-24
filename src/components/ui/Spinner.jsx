import { cn } from '../../lib/cn';

/**
 * Indicador de carregamento.
 *
 * `motion-reduce:` desacelera a rotação para quem pediu "reduzir movimento"
 * no sistema — para parte das pessoas, animação rápida em loop causa enjoo de
 * verdade. Note que ele fica LENTO em vez de parar: um spinner parado passa a
 * mensagem errada, a de que travou.
 */
export default function Spinner({ className, label = 'Carregando' }) {
    return (
        <span role="status" aria-live="polite" className={cn('inline-flex', className)}>
            <span
                aria-hidden="true"
                className="size-6 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600 motion-reduce:animate-[spin_2s_linear_infinite]"
            />
            <span className="sr-only">{label}…</span>
        </span>
    );
}
