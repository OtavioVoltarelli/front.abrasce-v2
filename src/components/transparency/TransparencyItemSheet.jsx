import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { fileKind } from '../../lib/fileKind';
import { accentVars } from '../../lib/palette';
import { countDescendants, hasNameIn, isFolderNode, nameProblem } from '../../hooks/useTransparency';
import { transparencyFileUrl } from '../../services/transparencyService';

/**
 * Gaveta de um item da árvore: renomear, mover, baixar (arquivo), excluir.
 *
 * Mesmo papel da `MediaFileSheet` na biblioteca de arquivos: uma linha de
 * 320px não tem espaço para quatro botões rotulados, então um "⋯" abre isto,
 * onde cada ação tem nome por extenso e 44px de alto.
 *
 * MOVER abre outro modal (`TransparencyMovePicker`), não um formulário aqui
 * dentro — precisa navegar pela árvore pra escolher o destino, e isso não
 * cabe dentro desta gaveta sem ela virar duas telas disfarçadas de uma.
 */
export default function TransparencyItemSheet({
    item,
    existingNames,
    onClose,
    renameMutation,
    onRenamed,
    onRequestMove,
    onRequestDelete,
}) {
    const [name, setName] = useState(item.name);
    const [nameError, setNameError] = useState(null);

    const isFolder = isFolderNode(item);
    const kind = isFolder ? null : fileKind({ name: item.name });
    const nameChanged = name.trim() !== item.name && name.trim().length > 0;
    const itemCount = isFolder ? countDescendants(item) : 0;

    const handleRename = (event) => {
        event.preventDefault();
        const trimmed = name.trim();
        const problem = nameProblem(trimmed);
        if (problem) {
            setNameError(problem);
            return;
        }
        if (hasNameIn(existingNames.filter((existing) => existing !== item.name), trimmed)) {
            setNameError('Já existe um item com este nome aqui.');
            return;
        }
        setNameError(null);
        /* Fecha a gaveta ao terminar. Antes ela ficava aberta mostrando o item
           ANTIGO (nome e caminho de antes do rename): "Mover" e "Excluir" a
           partir dali apontavam para um caminho que não existia mais — e o
           excluir chegava a responder "foi excluído" sem apagar nada. */
        renameMutation.mutate({ path: item.id, name: trimmed }, { onSuccess: () => onRenamed(item, trimmed) });
    };

    return (
        <Modal isOpen onClose={onClose} title={item.name} size="lg">
            <div className="space-y-6">
                <div className="flex items-center gap-3 rounded-xl bg-sand p-4 ring-1 ring-line">
                    <span
                        style={accentVars(isFolder ? 'sun' : kind.accent)}
                        aria-hidden="true"
                        className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--accent-tint)] text-[var(--accent-ink)]"
                    >
                        {isFolder ? (
                            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8h9a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                            </svg>
                        ) : (
                            kind.icon
                        )}
                    </span>
                    <p className="text-sm text-ink-800">
                        {isFolder
                            ? itemCount === 0
                                ? 'Pasta vazia.'
                                : `${itemCount} ${itemCount === 1 ? 'item' : 'itens'} dentro desta pasta.`
                            : kind.singular}
                    </p>
                </div>

                {/* ------------------------------------------------- RENOMEAR */}
                <form onSubmit={handleRename} noValidate className="space-y-3">
                    <Input
                        label="Nome"
                        name="name"
                        value={name}
                        onChange={(event) => { setName(event.target.value); setNameError(null); }}
                        maxLength={120}
                        error={nameError}
                    />
                    {renameMutation.isError && (
                        <p role="alert" className="text-sm font-semibold text-berry-ink">
                            {renameMutation.error?.message}
                        </p>
                    )}
                    <Button type="submit" fullWidth disabled={!nameChanged || renameMutation.isPending}>
                        {renameMutation.isPending ? 'Salvando…' : 'Salvar nome'}
                    </Button>
                </form>

                {/* ---------------------------------------------------- MOVER */}
                <Button variant="secondary" fullWidth onClick={() => onRequestMove(item)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8h9a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                        <path d="M12 10v5M9.5 12.5 12 10l2.5 2.5" />
                    </svg>
                    Mover para outra pasta
                </Button>

                {/* --------------------------------------------------- BAIXAR */}
                {!isFolder && (
                    <Button href={transparencyFileUrl(item.id)} variant="secondary" fullWidth>
                        Abrir / baixar arquivo
                    </Button>
                )}

                {/* -------------------------------------------------- EXCLUIR */}
                <section className="rounded-xl bg-berry-tint p-4 ring-1 ring-berry/25">
                    <h3 className="text-sm font-bold text-berry-ink">
                        {isFolder ? 'Excluir esta pasta' : 'Excluir este arquivo'}
                    </h3>
                    <p className="mt-1 text-sm text-ink-800/85">
                        {isFolder && itemCount > 0
                            ? `Apaga a pasta e tudo dentro dela — ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}. Não dá para desfazer.`
                            : 'Não dá para desfazer.'}
                    </p>
                    <Button
                        variant="danger"
                        fullWidth
                        className="mt-3"
                        onClick={() => onRequestDelete(item)}
                    >
                        {isFolder ? 'Excluir pasta' : 'Excluir arquivo'}
                    </Button>
                </section>
            </div>
        </Modal>
    );
}
