import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';

/**
 * Janela sobreposta (modal).
 *
 * No celular ela sobe do rodapé como uma "gaveta" e ocupa a largura toda; a
 * partir do tablet vira uma caixa centralizada. A razão é o polegar: numa
 * caixa centralizada no celular, o botão de fechar fica perto do topo da tela,
 * onde o polegar não alcança sem trocar a mão de posição.
 *
 * Quatro comportamentos que um modal precisa ter e que dá para esquecer:
 *
 *  1. ESC fecha.
 *  2. O fundo da página para de rolar. Sem isso, no celular, rolar dentro do
 *     modal "vaza" e a página de trás rola junto.
 *  3. O foco do teclado entra no modal e não sai enquanto ele estiver aberto —
 *     senão, apertando Tab, a pessoa passeia pelos links da página escondida
 *     atrás, sem ver onde está.
 *  4. Ao fechar, o foco volta para o elemento que abriu o modal.
 */

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }) {
    const panelRef = useRef(null);
    const previouslyFocused = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        previouslyFocused.current = document.activeElement;

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        const panel = panelRef.current;
        panel?.querySelector(FOCUSABLE)?.focus() ?? panel?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                return;
            }
            if (event.key !== 'Tab' || !panel) return;

            const focusable = [...panel.querySelectorAll(FOCUSABLE)];
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            // Shift+Tab no primeiro elemento volta para o último, e vice-versa:
            // é isso que fecha o "circuito" do foco dentro do modal.
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = overflow;
            previouslyFocused.current?.focus?.();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
            onClick={onClose}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
                /* stopPropagation: clicar DENTRO do painel não deve fechar.
                   O clique no fundo escuro fecha; o clique no conteúdo, não. */
                onClick={(event) => event.stopPropagation()}
                className={cn(
                    'w-full max-h-[92vh] overflow-y-auto rounded-t-2xl bg-white shadow-lift',
                    'sm:rounded-2xl',
                    sizes[size]
                )}
            >
                {/* Pega-dedo: a barrinha que sinaliza "isto é uma gaveta que
                    dá para arrastar/fechar". Só no celular. */}
                <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 rounded-full bg-line sm:hidden" />

                <div className="flex items-start gap-4 px-5 pb-4 pt-4 sm:px-6 sm:pt-6">
                    <div className="min-w-0 flex-1">
                        <h2 id="modal-title" className="text-xl text-ink-900 sm:text-2xl">
                            {title}
                        </h2>
                        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                        className="-mr-2 grid size-11 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-ink-900"
                    >
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>

                {footer && (
                    <div className="sticky bottom-0 border-t border-line bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
