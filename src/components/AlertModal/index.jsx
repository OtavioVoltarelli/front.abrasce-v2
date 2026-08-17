import './style.css';

/**
 * Modal de aviso e de confirmação.
 *
 * Sem `onConfirm` funciona como antes: mensagem + botão "Fechar".
 * Com `onConfirm`, vira uma confirmação com dois botões — foi o que
 * substituiu o window.confirm() das telas de admin.
 */
function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    isConfirming = false,
}) {
    if (!isOpen) return null;

    const isConfirmMode = typeof onConfirm === 'function';

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <p>{message}</p>

                {isConfirmMode ? (
                    /* Alvos de toque com min-h-11 (44px): o mínimo confortável
                       para o dedo. Botão perigoso à direita, para não ser o
                       primeiro que o polegar alcança por acidente. */
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isConfirming}
                            className="min-h-11 rounded border border-brand px-6 text-brand disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className="min-h-11 rounded bg-red-600 px-6 font-semibold text-white disabled:opacity-50"
                        >
                            {isConfirming ? 'Excluindo…' : confirmLabel}
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={onClose}>
                        Fechar
                    </button>
                )}
            </div>
        </div>
    );
}

export default AlertModal;
