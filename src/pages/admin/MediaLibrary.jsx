import { useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Skeleton from '../../components/feedback/Skeleton';
import ErrorState from '../../components/feedback/ErrorState';
import EmptyState from '../../components/feedback/EmptyState';
import LoadMore from '../../components/feedback/LoadMore';
import FileThumbnail from '../../components/media/FileThumbnail';
import MediaSearchBar from '../../components/media/MediaSearchBar';
import MediaUploadPanel from '../../components/media/MediaUploadPanel';
import MediaFileSheet from '../../components/media/MediaFileSheet';
import { fileKind } from '../../lib/fileKind';
import { formatShortDate } from '../../lib/format';
import { accentVars } from '../../lib/palette';
import {
    useCreateReusableFile,
    useDeleteReusableFile,
    useDownloadReusableFile,
    useFileUsages,
    useRenameReusableFile,
    useReplaceReusableFile,
    useReusableFilePages,
} from '../../hooks/useReusableFiles';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

/**
 * Biblioteca de arquivos reutilizáveis.
 *
 * Um arquivo sobe UMA vez e é referenciado por vários conteúdos. Hoje só a
 * capa das notícias aponta para cá; a arquitetura do backend (`ReusableFile` é
 * uma tabela própria e `News.coverImage` é chave estrangeira) já está pronta
 * para projetos, banners e o que vier.
 *
 * A diferença entre isto e "uma tela com uploads" está na exclusão: aqui um
 * arquivo sabe quem o usa, e a tela impede a exclusão em vez de deixar o banco
 * recusar depois. O número vem em `usageCount`, calculado pelo backend.
 */

/** 24: preenche por igual as grades de 2, 3 e 4 colunas. */
const PAGE_SIZE = 24;

export default function AdminMediaLibrary() {
    const [search, setSearch] = useState('');
    const [kindFilter, setKindFilter] = useState('all');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [openFile, setOpenFile] = useState(null);
    const [fileToDelete, setFileToDelete] = useState(null);
    const [flash, setFlash] = useState(null);

    const debouncedSearch = useDebouncedValue(search);
    const query = useReusableFilePages({ search: debouncedSearch, kind: kindFilter, pageSize: PAGE_SIZE });
    const usages = useFileUsages(openFile?.id);
    const createMutation = useCreateReusableFile();
    const renameMutation = useRenameReusableFile();
    const replaceMutation = useReplaceReusableFile();
    const downloadMutation = useDownloadReusableFile();
    const deleteMutation = useDeleteReusableFile();

    const files = query.data ?? [];
    const isFiltering = Boolean(debouncedSearch.trim()) || kindFilter !== 'all';

    const handleUpload = ({ file, name }) => {
        createMutation.mutate(
            { file, name },
            {
                onSuccess: (created) => {
                    setIsUploadOpen(false);
                    setFlash(`"${created.name}" foi adicionado à biblioteca.`);
                },
            }
        );
    };

    const handleDelete = () => {
        deleteMutation.mutate(fileToDelete.id, {
            onSuccess: () => {
                setFileToDelete(null);
                setOpenFile(null);
                setFlash(`"${fileToDelete.name}" foi excluído.`);
            },
        });
    };

    return (
        <AdminPage
            title="Arquivos reutilizáveis"
            description="Imagens, PDFs e documentos que podem ser usados em vários conteúdos do site."
            action={
                <Button size="lg" onClick={() => setIsUploadOpen(true)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Adicionar arquivo
                </Button>
            }
        >
            {/* `role="status"`: o leitor de tela anuncia a confirmação sem tirar
                o foco de onde a pessoa está. `role="alert"` interromperia. */}
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

            <MediaSearchBar
                search={search}
                onSearchChange={setSearch}
                kindFilter={kindFilter}
                onKindFilterChange={setKindFilter}
                resultCount={query.totalElements}
                isUpdating={search !== debouncedSearch || query.isPlaceholderData}
            />

            <div className="mt-5">
                {query.isPending && (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                            <li key={index} className="rounded-2xl bg-white p-3 ring-1 ring-line">
                                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                                <Skeleton className="mt-3 h-4 w-full" />
                                <Skeleton className="mt-2 h-3 w-2/3" />
                                <Skeleton className="mt-3 h-11 w-full rounded-xl" />
                            </li>
                        ))}
                    </ul>
                )}

                {query.isError && (
                    <ErrorState
                        title="Não foi possível carregar a biblioteca"
                        error={query.error}
                        onRetry={() => query.refetch()}
                    />
                )}

                {!query.isPending && !query.isError && files.length === 0 && (
                    <EmptyState
                        title={isFiltering ? 'Nenhum arquivo encontrado' : 'A biblioteca ainda está vazia'}
                        description={
                            isFiltering
                                ? 'Tente outra palavra, ou volte o filtro de tipo para "Todos".'
                                : 'Envie a primeira imagem ou documento. Depois disso, ele pode ser usado em quantos conteúdos você quiser.'
                        }
                    />
                )}

                {files.length > 0 && (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                        {files.map((file) => {
                            const kind = fileKind(file);

                            return (
                                <li key={file.id}>
                                    <article className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-card ring-1 ring-line">
                                        <span className="block aspect-[4/3] overflow-hidden rounded-lg">
                                            <FileThumbnail file={file} />
                                        </span>

                                        {/* `line-clamp` em vez de `truncate`: nomes de
                                            arquivo são compridos, e cortar na primeira
                                            linha esconde justamente o que diferencia
                                            "relatorio-2025" de "relatorio-2026". */}
                                        <h3 className="clamp-2 mt-3 min-h-10 text-sm font-bold leading-tight text-ink-900">
                                            {file.name}
                                        </h3>

                                        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
                                            <span
                                                style={accentVars(kind.accent)}
                                                className="font-semibold text-[var(--accent-ink)]"
                                            >
                                                {kind.singular}
                                            </span>
                                            <span aria-hidden="true">·</span>
                                            <span>{formatShortDate(file.creationDate)}</span>
                                        </p>

                                        {/* A contagem de uso fica no card, e não só na
                                            gaveta: é a informação que decide se dá para
                                            excluir, e ela precisa aparecer ANTES de a
                                            pessoa tentar. */}
                                        {file.usageCount > 0 && (
                                            <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-lagoon-tint px-2 py-0.5 text-[0.6875rem] font-bold text-lagoon-ink">
                                                {file.usageCount === 1 ? 'em 1 conteúdo' : `em ${file.usageCount} conteúdos`}
                                            </p>
                                        )}

                                        <Button
                                            variant="secondary"
                                            fullWidth
                                            className="mt-3"
                                            onClick={() => setOpenFile(file)}
                                        >
                                            Opções
                                            <span className="sr-only"> de {file.name}</span>
                                        </Button>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <LoadMore query={query} noun="arquivos" />
            </div>

            <Modal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                title="Adicionar arquivo"
                description="Imagem ou PDF."
                size="lg"
            >
                <MediaUploadPanel
                    isPending={createMutation.isPending}
                    error={createMutation.isError ? createMutation.error?.message : null}
                    onSubmit={handleUpload}
                    onCancel={() => setIsUploadOpen(false)}
                />
            </Modal>

            {/* `key`: ao abrir outro arquivo, o React recria a gaveta em vez de
                reaproveitar o campo de nome preenchido com o arquivo anterior. */}
            {openFile && (
                <MediaFileSheet
                    key={openFile.id}
                    file={query.data?.find((item) => item.id === openFile.id) ?? openFile}
                    usages={usages}
                    onClose={() => setOpenFile(null)}
                    renameMutation={renameMutation}
                    replaceMutation={replaceMutation}
                    downloadMutation={downloadMutation}
                    onRequestDelete={setFileToDelete}
                />
            )}

            <ConfirmDialog
                isOpen={Boolean(fileToDelete)}
                onClose={() => setFileToDelete(null)}
                onConfirm={handleDelete}
                isPending={deleteMutation.isPending}
                title="Excluir arquivo?"
                description={`"${fileToDelete?.name}" sai da biblioteca e do servidor. Esta ação não pode ser desfeita.`}
                confirmLabel="Sim, excluir"
                error={deleteMutation.isError ? deleteMutation.error?.message : null}
            />
        </AdminPage>
    );
}
