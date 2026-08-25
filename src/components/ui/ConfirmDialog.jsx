import Modal from './Modal';
import Button from './Button';

/**
 * Confirmação de uma ação destrutiva ("Excluir esta notícia?").
 *
 * Substitui o `window.confirm()`: aquele não dá para estilizar, aparece no
 * topo da tela travando o app inteiro e, no celular, é uma caixinha do sistema
 * que parece um alerta de vírus.
 *
 * No celular os botões ficam empilhados e em ordem INVERTIDA (`flex-col-reverse`):
 * o botão perigoso vai para baixo, mais longe do polegar em repouso. Ordem no
 * HTML continua "cancelar, confirmar" — o que muda é só a pintura na tela.
 */
export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Excluir',
    cancelLabel = 'Cancelar',
    isPending = false,
    tone = 'danger',
    error,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-[0.9375rem] text-ink-800">{description}</p>

            {/* A falha aparece DENTRO do diálogo, e ele não fecha. Fechar em
                caso de erro joga a mensagem numa tela que a pessoa já deixou
                para trás — e a ação que ela pediu não aconteceu. */}
            {error && (
                <p role="alert" className="mt-4 rounded-xl bg-berry-tint p-3 text-sm font-semibold text-berry-ink">
                    {error}
                </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={onClose} disabled={isPending}>
                    {cancelLabel}
                </Button>
                <Button variant={tone} onClick={onConfirm} disabled={isPending}>
                    {isPending ? 'Aguarde…' : confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
