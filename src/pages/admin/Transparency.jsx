import { useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Skeleton from '../../components/feedback/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import EmptyState from '../../components/feedback/EmptyState';
import TransparencyBreadcrumb from '../../components/transparency/TransparencyBreadcrumb';
import TransparencyItemRow from '../../components/transparency/TransparencyItemRow';
import TransparencyItemSheet from '../../components/transparency/TransparencyItemSheet';
import TransparencyMovePicker from '../../components/transparency/TransparencyMovePicker';
import TransparencyCreateModal from '../../components/transparency/TransparencyCreateModal';
import {
    countDescendants,
    isFolderNode,
    joinPath,
    useDeleteTransparencyPath,
    useMoveTransparencyPath,
    useRenameTransparencyPath,
    useTransparencyBrowser,
    useTransparencyTree,
} from '../../hooks/useTransparency';

/**
 * Administração da transparência: os mesmos documentos que a página pública
 * mostra, só que aqui dá para criar pasta, enviar, renomear, mover e excluir.
 *
 * ---------------------------------------------------------------------------
 * PASTA POR PASTA, NÃO A ÁRVORE INTEIRA ABERTA
 * ---------------------------------------------------------------------------
 * A página pública usa uma árvore (`react-arborist`) porque lá só existe UMA
 * ação: tocar para abrir. Aqui existem cinco (criar, enviar, renomear, mover,
 * excluir), e uma árvore com ações por linha, no celular, não escala —
 * indentação come a largura, e arrastar para mover é impreciso no dedo (é
 * por isso que a própria árvore pública desliga o `disableDrag`). A navegação
 * pasta-por-pasta com uma trilha no topo é o padrão que os aplicativos de
 * arquivo do celular convergiram pra exatamente este problema.
 */
export default function AdminTransparency() {
    const query = useTransparencyTree();
    const browser = useTransparencyBrowser(query.data);

    const [openItem, setOpenItem] = useState(null);
    const [itemToMove, setItemToMove] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [flash, setFlash] = useState(null);

    const renameMutation = useRenameTransparencyPath();
    const moveMutation = useMoveTransparencyPath();
    const deleteMutation = useDeleteTransparencyPath();

    const existingNames = browser.items.map((item) => item.name);

    const handleConfirmMove = (destinationFolderId) => {
        const to = joinPath(destinationFolderId, itemToMove.name);
        moveMutation.mutate(
            { from: itemToMove.id, to },
            {
                onSuccess: () => {
                    setItemToMove(null);
                    setFlash(`"${itemToMove.name}" foi movido.`);
                },
            }
        );
    };

    const handleConfirmDelete = () => {
        deleteMutation.mutate(itemToDelete.id, {
            onSuccess: () => {
                setItemToDelete(null);
                setOpenItem(null);
                setFlash(`"${itemToDelete.name}" foi excluído.`);
            },
        });
    };

    // Contagem RECURSIVA, não só dos filhos diretos — testado contra a árvore
    // real do backend (1832 nós): uma pasta de topo tem poucos filhos diretos
    // escondendo centenas de arquivos, e o aviso de uma exclusão que apaga
    // tudo recursivamente (`FileService.deleteTransparencyPath`) precisa do
    // número de verdade.
    const deleteDescendantCount =
        itemToDelete && isFolderNode(itemToDelete) ? countDescendants(itemToDelete) : 0;

    return (
        <AdminPage
            title="Transparência"
            description="Balanços, certidões, relatórios e outros documentos públicos, organizados por pasta."
            action={
                <Button size="lg" onClick={() => setIsCreateOpen(true)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Novo
                </Button>
            }
        >
            {flash && (
                <div role="status" className="mb-5 flex items-start gap-3 rounded-xl bg-leaf-tint p-4 ring-1 ring-leaf/25">
                    <p className="flex-1 text-sm font-semibold text-leaf-ink">{flash}</p>
                    <button
                        type="button"
                        onClick={() => setFlash(null)}
                        className="-m-1 grid size-8 shrink-0 place-items-center rounded-lg text-leaf-ink hover:bg-white/60"
                    >
                        <span className="sr-only">Dispensar aviso</span>
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {query.isPending && (
                <ul className="space-y-2">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <li key={index}>
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </li>
                    ))}
                </ul>
            )}

            {query.isError && (
                <ErrorState
                    title="Não foi possível carregar os documentos"
                    error={query.error}
                    onRetry={() => query.refetch()}
                />
            )}

            {!query.isPending && !query.isError && (
                <div className="space-y-4">
                    <TransparencyBreadcrumb crumbs={browser.crumbs} onNavigate={browser.goTo} />

                    {browser.items.length === 0 ? (
                        <EmptyState
                            title="Pasta vazia"
                            description="Toque em “Novo” para criar uma subpasta ou enviar um documento aqui."
                        />
                    ) : (
                        <ul className="space-y-2">
                            {browser.items.map((item) => (
                                <TransparencyItemRow
                                    key={item.id}
                                    item={item}
                                    onEnter={browser.enter}
                                    onOpenActions={setOpenItem}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {openItem && (
                <TransparencyItemSheet
                    key={openItem.id}
                    item={openItem}
                    existingNames={existingNames}
                    onClose={() => setOpenItem(null)}
                    renameMutation={renameMutation}
                    onRequestMove={(item) => {
                        setOpenItem(null);
                        setItemToMove(item);
                    }}
                    onRequestDelete={(item) => {
                        setOpenItem(null);
                        setItemToDelete(item);
                    }}
                />
            )}

            {itemToMove && (
                <TransparencyMovePicker
                    isOpen
                    item={itemToMove}
                    tree={query.data}
                    onClose={() => { setItemToMove(null); moveMutation.reset(); }}
                    onConfirm={handleConfirmMove}
                    isPending={moveMutation.isPending}
                    error={moveMutation.isError ? moveMutation.error?.message : null}
                />
            )}

            <ConfirmDialog
                isOpen={Boolean(itemToDelete)}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                isPending={deleteMutation.isPending}
                title={itemToDelete && isFolderNode(itemToDelete) ? 'Excluir pasta?' : 'Excluir arquivo?'}
                description={
                    itemToDelete
                        ? deleteDescendantCount > 0
                            ? `"${itemToDelete.name}" e os ${deleteDescendantCount} ${deleteDescendantCount === 1 ? 'item' : 'itens'} dentro dela saem do servidor. Esta ação não pode ser desfeita.`
                            : `"${itemToDelete.name}" sai do servidor. Esta ação não pode ser desfeita.`
                        : ''
                }
                confirmLabel="Sim, excluir"
                error={deleteMutation.isError ? deleteMutation.error?.message : null}
            />

            <TransparencyCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                folderId={browser.currentFolderId}
                existingNames={existingNames}
            />
        </AdminPage>
    );
}
