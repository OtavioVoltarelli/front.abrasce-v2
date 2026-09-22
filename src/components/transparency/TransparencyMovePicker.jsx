import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { accentVars } from '../../lib/palette';
import TransparencyBreadcrumb from './TransparencyBreadcrumb';
import { isFolderNode, isSameOrDescendant, parentIdOf, useTransparencyBrowser } from '../../hooks/useTransparency';

/**
 * "Mover para onde?" — a mesma navegação pasta-por-pasta da tela principal,
 * só que dentro de um modal, mostrando só pastas (não faz sentido soltar um
 * documento dentro de outro documento) e terminando num botão só: "Mover
 * para cá", que confirma a pasta ONDE O MODAL ESTÁ no momento.
 *
 * Isto substitui arrastar-e-soltar de propósito — a página pública já
 * desliga o drag da árvore pelo mesmo motivo: o dedo não arrasta com a
 * precisão que mover um item exige.
 */
export default function TransparencyMovePicker({ isOpen, onClose, item, tree, onConfirm, isPending, error }) {
    const browser = useTransparencyBrowser(tree);
    const folders = browser.items.filter(isFolderNode);

    // Não dá para mover uma pasta para dentro dela mesma, nem de uma pasta
    // que vive dentro dela — a operação quebraria no disco do servidor, não
    // só na tela.
    const destinationIsInvalid =
        browser.currentFolderId !== null && isSameOrDescendant(item.id, browser.currentFolderId);
    const isAlreadyHere = browser.currentFolderId === parentIdOf(item.id);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Mover "${item.name}"`}
            description="Escolha a pasta de destino."
            size="lg"
            footer={
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="secondary" size="lg" fullWidth className="sm:w-auto" onClick={onClose} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button
                        size="lg"
                        fullWidth
                        className="sm:w-auto"
                        onClick={() => onConfirm(browser.currentFolderId)}
                        disabled={destinationIsInvalid || isAlreadyHere || isPending}
                    >
                        {isPending ? 'Movendo…' : 'Mover para cá'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <TransparencyBreadcrumb crumbs={browser.crumbs} onNavigate={browser.goTo} />

                {error && (
                    <p role="alert" className="rounded-xl bg-berry-tint p-3 text-sm font-semibold text-berry-ink">
                        {error}
                    </p>
                )}

                {destinationIsInvalid && (
                    <p className="rounded-xl bg-sun-tint p-3 text-sm font-semibold text-sun-ink">
                        Não é possível mover uma pasta para dentro dela mesma.
                    </p>
                )}

                {folders.length === 0 ? (
                    <p className="rounded-xl bg-sand p-6 text-center text-sm text-muted">
                        Esta pasta não tem subpastas. Toque em "Mover para cá" para colocar o item aqui.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {folders.map((folder) => (
                            <li key={folder.id}>
                                <button
                                    type="button"
                                    onClick={() => browser.enter(folder.id)}
                                    className="flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left ring-1 ring-line transition-colors hover:bg-sand"
                                >
                                    <span style={accentVars('sun')} aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--accent-tint)] text-[var(--accent-ink)]">
                                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8h9a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                                        </svg>
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{folder.name}</span>
                                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m7.5 5 5 5-5 5" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
    );
}
