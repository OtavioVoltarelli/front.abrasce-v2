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
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-[0.9375rem] text-ink-800">{description}</p>

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
