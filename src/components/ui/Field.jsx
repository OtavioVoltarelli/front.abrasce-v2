import { useId } from 'react';
import { cn } from '../../lib/cn';

/**
 * Esqueleto compartilhado de um campo de formulário: rótulo, dica, controle e
 * mensagem de erro — sempre na mesma ordem e com as ligações de acessibilidade
 * já feitas.
 *
 * As três ligações que quase todo formulário na internet esquece:
 *
 *  1. `htmlFor` do <label> = `id` do controle. É o que faz TOCAR NO RÓTULO
 *     focar o campo. No celular isso dobra o tamanho do alvo de toque.
 *  2. `aria-describedby` aponta para a dica e para o erro. Sem isso, quem usa
 *     leitor de tela ouve "Telefone, campo de texto" e nunca fica sabendo que
 *     havia uma mensagem de erro logo abaixo.
 *  3. `aria-invalid` marca o campo como inválido de forma que o leitor de tela
 *     entenda — a borda vermelha sozinha não comunica nada para quem não vê.
 *
 * O `useId` gera um identificador único e estável por instância, então dois
 * campos "Nome" na mesma página não colidem — a não ser que o formulário
 * precise de um id PREVISÍVEL (ver `idProp`), para apontar para este campo
 * de fora (ex.: rolar até o primeiro erro na hora de validar).
 */
export default function Field({ id: idProp, label, hint, error, required, className, children }) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <label htmlFor={id} className="text-sm font-semibold text-ink-800">
                {label}
                {required && (
                    <span className="ml-1 font-normal text-muted">(obrigatório)</span>
                )}
            </label>

            {hint && (
                <p id={hintId} className="text-xs text-muted">
                    {hint}
                </p>
            )}

            {children({ id, describedBy, invalid: Boolean(error) })}

            {error && (
                /* `role="alert"` faz o leitor de tela anunciar a mensagem assim
                   que ela aparece, sem esperar a pessoa navegar até ali. */
                <p id={errorId} role="alert" className="flex items-start gap-1.5 text-sm font-medium text-red-700">
                    <span aria-hidden="true">⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}
