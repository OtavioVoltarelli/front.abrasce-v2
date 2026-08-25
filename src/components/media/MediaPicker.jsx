import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Skeleton from '../feedback/Skeleton';
import FileThumbnail from './FileThumbnail';
import MediaUploadPanel from './MediaUploadPanel';
import MediaSearchBar from './MediaSearchBar';
import { formatShortDate } from '../../lib/format';
import { fileKind } from '../../lib/fileKind';
import {
    useCreateReusableFile,
    useFilteredFiles,
    useReusableFiles,
} from '../../hooks/useReusableFiles';

/**
 * Seletor de mídia — escolher um arquivo já existente na biblioteca.
 * ---------------------------------------------------------------------------
 * Este é o componente que o resto do sistema vai reaproveitar. Hoje só a capa
 * da notícia o usa; amanhã, a imagem de um projeto ou o banner da home usam o
 * MESMO componente, passando outro `kind`. Por isso ele não sabe nada sobre
 * notícias: recebe `isOpen`, `selectedId` e devolve o arquivo escolhido por
 * `onSelect`. Quem chama decide o que fazer com ele.
 *
 * ---------------------------------------------------------------------------
 * DUAS DECISÕES QUE VALEM EXPLICAR
 * ---------------------------------------------------------------------------
 * 1. ESCOLHER E CONFIRMAR SÃO DOIS PASSOS. Tocar num arquivo o marca; um botão
 *    no rodapé confirma. Selecionar-e-fechar no primeiro toque é mais rápido e
 *    é errado no celular: o dedo cobre boa parte da miniatura, e um toque
 *    impreciso trocaria a capa sem a pessoa ver qual escolheu. Com dois
 *    passos, o erro é visível e corrigível antes de valer.
 *
 * 2. DÁ PARA ENVIAR UM ARQUIVO NOVO DAQUI DE DENTRO. Sem isso, quem estivesse
 *    escrevendo uma notícia e percebesse que a imagem não está na biblioteca
 *    teria que sair do formulário — perdendo o texto já digitado.
 *    É o mesmo modal trocando de painel, e não um segundo modal por cima do
 *    primeiro: modal sobre modal empilha duas armadilhas de foco e, no
 *    celular, some com o contexto todo.
 */
export default function MediaPicker({
    isOpen,
    onClose,
    onSelect,
    selectedId = null,
    kind = 'all',
    title = 'Selecionar arquivo',
}) {
    const [panel, setPanel] = useState('browse');
    const [pendingId, setPendingId] = useState(selectedId);
    const [search, setSearch] = useState('');
    const [kindFilter, setKindFilter] = useState('all');

    const query = useReusableFiles();
    const createMutation = useCreateReusableFile();

    /* Quando o seletor é aberto para um campo de imagem, arquivos que não são
       imagem sequer aparecem — oferecer um PDF para ser capa de notícia é
       oferecer um erro. */
    const available = (query.data ?? []).filter(
        (file) => kind === 'all' || fileKind(file).id === kind
    );
    const files = useFilteredFiles(available, { search, kind: kindFilter });

    const close = () => {
        setPanel('browse');
        setSearch('');
        setKindFilter('all');
        setPendingId(selectedId);
        onClose();
    };

    const confirm = () => {
        const chosen = available.find((file) => file.id === pendingId);
        if (!chosen) return;
        onSelect(chosen);
        close();
    };

    const handleUpload = ({ file, name }) => {
        createMutation.mutate(
            { file, name },
            {
                onSuccess: (created) => {
                    /* Sobe e já entrega: o arquivo recém-enviado é, quase
                       sempre, exatamente o que a pessoa veio buscar. Voltar
                       para a grade e obrigá-la a procurá-lo seria trabalho
                       inventado. */
                    onSelect(created);
                    close();
                },
            }
        );
    };

    if (panel === 'upload') {
        return (
            <Modal
                isOpen={isOpen}
                onClose={close}
                title="Enviar novo arquivo"
                description="Ele entra na biblioteca e já fica selecionado aqui."
                size="lg"
            >
                <MediaUploadPanel
                    accept={kind === 'image' ? 'image/*' : undefined}
                    submitLabel="Enviar e usar"
                    isPending={createMutation.isPending}
                    error={createMutation.isError ? createMutation.error?.message : null}
                    onSubmit={handleUpload}
                    onCancel={() => setPanel('browse')}
                />
            </Modal>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={close}
            title={title}
            size="lg"
            footer={
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="secondary" size="lg" fullWidth className="sm:w-auto" onClick={close}>
                        Cancelar
                    </Button>
                    <Button
                        size="lg"
                        fullWidth
                        className="sm:w-auto"
                        onClick={confirm}
                        disabled={pendingId === null}
                    >
                        Usar este arquivo
                    </Button>
                </div>
            }
        >
            <div className="space-y-4">
                <MediaSearchBar
                    search={search}
                    onSearchChange={setSearch}
                    kindFilter={kindFilter}
                    onKindFilterChange={setKindFilter}
                    showKindFilter={kind === 'all'}
                    resultCount={files.length}
                />

                <Button variant="secondary" fullWidth onClick={() => setPanel('upload')}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Enviar novo arquivo
                </Button>

                {query.isPending && (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <li key={index}>
                                <Skeleton className="aspect-square w-full rounded-xl" />
                                <Skeleton className="mt-2 h-3 w-3/4" />
                            </li>
                        ))}
                    </ul>
                )}

                {query.isError && (
                    <p role="alert" className="rounded-xl bg-berry-tint p-4 text-sm font-semibold text-berry-ink">
                        Não foi possível carregar a biblioteca. {query.error?.message}
                    </p>
                )}

                {/* Dois vazios diferentes: "a biblioteca está vazia" pede um
                    upload; "a busca não achou nada" pede outra busca. A mesma
                    frase para os dois casos manda a pessoa para o lado errado. */}
                {!query.isPending && !query.isError && files.length === 0 && (
                    <p className="rounded-xl bg-sand p-6 text-center text-sm text-muted">
                        {available.length === 0
                            ? 'A biblioteca ainda não tem nenhum arquivo deste tipo. Envie o primeiro pelo botão acima.'
                            : 'Nenhum arquivo encontrado com esse termo. Tente outra palavra ou limpe a busca.'}
                    </p>
                )}

                {files.length > 0 && (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {files.map((file) => {
                            const isPending = file.id === pendingId;
                            return (
                                <li key={file.id}>
                                    <button
                                        type="button"
                                        onClick={() => setPendingId(file.id)}
                                        aria-pressed={isPending}
                                        className={`group w-full rounded-xl p-1.5 text-left transition-colors ${
                                            isPending ? 'bg-brand-50 ring-2 ring-brand-600' : 'ring-1 ring-line hover:bg-sand'
                                        }`}
                                    >
                                        <span className="relative block aspect-square overflow-hidden rounded-lg">
                                            <FileThumbnail file={file} />
                                            {/* O "escolhido" não é só a moldura:
                                                moldura sozinha é cor, e cor
                                                sozinha não comunica para quem
                                                não a distingue. O visto é forma. */}
                                            {isPending && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-brand-600 text-white shadow-card"
                                                >
                                                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="m5 13 4 4L19 7" />
                                                    </svg>
                                                </span>
                                            )}
                                        </span>
                                        <span className="mt-2 block truncate px-0.5 text-xs font-semibold text-ink-900">
                                            {file.name}
                                        </span>
                                        <span className="block truncate px-0.5 text-[0.6875rem] text-muted">
                                            {fileKind(file).singular} · {formatShortDate(file.creationDate)}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </Modal>
    );
}
