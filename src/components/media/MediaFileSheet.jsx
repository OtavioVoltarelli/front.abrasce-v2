import { useId, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FileThumbnail from './FileThumbnail';
import Skeleton from '../feedback/Skeleton';
import LoadMore from '../feedback/LoadMore';
import { fileKind, isImage } from '../../lib/fileKind';
import { formatDateTime } from '../../lib/format';
import { fileUrl } from '../../services/config';
import { reusableFileDownloadUrl } from '../../services/reusableFileService';
import { accentVars } from '../../lib/palette';
import { acceptFor } from '../../lib/uploadRules';

/**
 * Gaveta de um arquivo da biblioteca: ver, renomear, substituir, baixar, excluir.
 *
 * ---------------------------------------------------------------------------
 * POR QUE UMA GAVETA E NÃO BOTÕES NO CARD
 * ---------------------------------------------------------------------------
 * Medida, não intuição: numa tela de 320px a grade de dois cards deixa 114px
 * úteis por card. "Editar" com preenchimento ocupa ~67px, então dois botões com
 * texto não cabem. As saídas eram três:
 *   · dois ícones sem texto (cabem em 96px) — mas lixeira e lápis mudos, para
 *     quem administra o site uma vez por mês, são adivinhação;
 *   · empilhar os botões — dobra a altura de cada card e reduz pela metade
 *     quantos arquivos cabem na tela;
 *   · UM botão rotulado que abre esta gaveta.
 * A terceira ganhou: um toque leva a todas as ações, cada uma com rótulo por
 * extenso e alvo de 44px, e o card continua compacto.
 *
 * ---------------------------------------------------------------------------
 * RENOMEAR E SUBSTITUIR SÃO DUAS COISAS, E A GAVETA MOSTRA ISSO
 * ---------------------------------------------------------------------------
 * O backend tem dois endpoints (`PUT {id}` e `PUT {id}/file`) e está certo:
 * corrigir o rótulo de uma imagem de 3 MB não deveria reenviar 3 MB.
 * Substituir MANTÉM o id — quem já aponta para o arquivo passa a ver o
 * conteúdo novo. Isso é poderoso e perigoso na mesma medida, então quando o
 * arquivo está em uso a gaveta avisa quantos conteúdos vão mudar junto.
 *
 * ---------------------------------------------------------------------------
 * QUANTOS E QUAIS VÊM DE LUGARES DIFERENTES
 * ---------------------------------------------------------------------------
 * `file.usageCount` (QUANTOS) chega junto com o arquivo, então a decisão de
 * travar ou liberar a exclusão sai na hora, sem esperar nada. `usages`
 * (QUAIS) é a lista paginada de `/usages`, buscada só quando a gaveta abre:
 * serve para a pessoa saber o que precisa trocar antes de excluir.
 */

/* O backend devolve o tipo de conteúdo como constante ("NEWS"). A tradução
   fica aqui, e um tipo novo sem tradução aparece cru em vez de sumir. */
const USAGE_TYPE_LABELS = { NEWS: 'Notícia' };

export default function MediaFileSheet({
    file,
    usages,
    onClose,
    renameMutation,
    replaceMutation,
    onRequestDelete,
}) {
    const replaceInputId = useId();
    const replaceInputRef = useRef(null);
    const [name, setName] = useState(file?.name ?? '');
    const [replacement, setReplacement] = useState(null);
    const [nameError, setNameError] = useState(null);

    if (!file) return null;

    const kind = fileKind(file);
    const usageCount = file.usageCount ?? 0;
    const isInUse = usageCount > 0;
    const nameChanged = name.trim() !== file.name && name.trim().length > 0;

    const handleRename = (event) => {
        event.preventDefault();
        if (!name.trim()) {
            setNameError('O nome não pode ficar em branco.');
            return;
        }
        setNameError(null);
        renameMutation.mutate({ id: file.id, name });
    };

    const handleReplace = () => {
        if (!replacement) return;
        replaceMutation.mutate(
            { id: file.id, file: replacement },
            { onSuccess: () => setReplacement(null) }
        );
    };

    return (
        <Modal isOpen onClose={onClose} title={file.name} size="lg">
            <div className="space-y-6">
                {/* ------------------------------------------ PRÉ-VISUALIZAÇÃO */}
                <div className="overflow-hidden rounded-xl ring-1 ring-line">
                    {isImage(file) ? (
                        <img
                            src={fileUrl('admin', file.storedName)}
                            alt=""
                            className="max-h-72 w-full bg-sand object-contain"
                        />
                    ) : (
                        <div className="grid h-40 place-items-center">
                            <FileThumbnail file={file} iconClassName="size-12" />
                        </div>
                    )}
                </div>

                {/* ------------------------------------------------- METADADOS */}
                {/* <dl>: cada item é um par termo + definição. Um leitor de tela
                    anuncia "Tipo, PDF" em vez de duas frases soltas. */}
                <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <dt className="text-xs text-muted">Tipo</dt>
                        <dd
                            style={accentVars(kind.accent)}
                            className="mt-0.5 font-semibold text-[var(--accent-ink)]"
                        >
                            {kind.singular}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs text-muted">Cadastrado em</dt>
                        <dd className="mt-0.5 font-semibold text-ink-900">
                            {formatDateTime(file.creationDate)}
                        </dd>
                    </div>
                    <div className="col-span-2 min-w-0">
                        <dt className="text-xs text-muted">Nome do arquivo</dt>
                        <dd className="mt-0.5 truncate font-semibold text-ink-900">
                            {file.originalName}
                        </dd>
                    </div>
                </dl>

                {/* --------------------------------------------------- EM USO */}
                <div className="rounded-xl bg-sand p-4 ring-1 ring-line">
                    <h3 className="text-sm font-bold text-ink-900">Onde está sendo usado</h3>
                    {!isInUse ? (
                        <p className="mt-1 text-sm text-muted">
                            Nenhum conteúdo usa este arquivo. Pode excluir com segurança.
                        </p>
                    ) : usages.isPending ? (
                        <Skeleton className="mt-2 h-4 w-40" />
                    ) : usages.isError ? (
                        <p role="alert" className="mt-1 text-sm text-berry-ink">
                            Em {usageCount === 1 ? '1 conteúdo' : `${usageCount} conteúdos`}, mas não foi
                            possível carregar quais.{' '}
                            <button type="button" onClick={() => usages.refetch()} className="min-h-11 font-semibold underline">
                                Tentar de novo
                            </button>
                        </p>
                    ) : (
                        <>
                            <ul className="mt-2 space-y-1">
                                {usages.data.map((item) => (
                                    <li key={`${item.type}-${item.id}`} className="text-sm text-ink-800">
                                        <span className="text-muted">{USAGE_TYPE_LABELS[item.type] ?? item.type}:</span>{' '}
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                            <LoadMore query={usages} noun="conteúdos" />
                        </>
                    )}
                </div>

                {/* ------------------------------------------------- RENOMEAR */}
                <form onSubmit={handleRename} noValidate className="space-y-3">
                    <Input
                        label="Nome na biblioteca"
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={255}
                        error={nameError}
                        hint="Só o rótulo. O arquivo continua o mesmo."
                    />
                    {renameMutation.isError && (
                        <p role="alert" className="text-sm font-semibold text-berry-ink">
                            {renameMutation.error?.message}
                        </p>
                    )}
                    {/* O botão só existe quando há o que salvar. Um "Salvar"
                        sempre habilitado convida a apertar sem ter mudado nada. */}
                    <Button type="submit" fullWidth disabled={!nameChanged || renameMutation.isPending}>
                        {renameMutation.isPending ? 'Salvando…' : 'Salvar nome'}
                    </Button>
                </form>

                {/* ---------------------------------------------- SUBSTITUIR */}
                <div className="space-y-3 rounded-xl bg-sun-tint p-4 ring-1 ring-sun/25">
                    <h3 className="text-sm font-bold text-sun-ink">Substituir o arquivo</h3>
                    <p className="text-sm text-ink-800/85">
                        O arquivo novo assume o lugar do atual mantendo o mesmo endereço.
                        {isInUse
                            ? ` ${usageCount === 1 ? 'O conteúdo listado acima passa' : `Os ${usageCount} conteúdos listados acima passam`} a mostrar o arquivo novo.`
                            : ' Nenhum conteúdo usa este arquivo hoje.'}
                    </p>

                    <input
                        ref={replaceInputRef}
                        id={replaceInputId}
                        type="file"
                        accept={acceptFor(kind.id)}
                        onChange={(event) => setReplacement(event.target.files?.[0] ?? null)}
                        className="sr-only"
                    />
                    <label
                        htmlFor={replaceInputId}
                        className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-ink-900 ring-1 ring-inset ring-line transition-colors hover:bg-sand"
                    >
                        {replacement ? 'Escolher outro arquivo' : 'Escolher arquivo novo'}
                    </label>

                    {replacement && (
                        <div aria-live="polite" className="space-y-3">
                            <p className="truncate text-sm font-semibold text-ink-900">
                                {replacement.name}
                            </p>
                            {replaceMutation.isError && (
                                <p role="alert" className="text-sm font-semibold text-berry-ink">
                                    {replaceMutation.error?.message}
                                </p>
                            )}
                            <Button fullWidth onClick={handleReplace} disabled={replaceMutation.isPending}>
                                {replaceMutation.isPending ? 'Substituindo…' : 'Substituir arquivo'}
                            </Button>
                        </div>
                    )}
                </div>

                {/* --------------------------------------------------- BAIXAR */}
                <Button href={reusableFileDownloadUrl(file)} variant="secondary" fullWidth>
                    Baixar arquivo
                </Button>

                {/* -------------------------------------------------- EXCLUIR */}
                <section className="rounded-xl bg-berry-tint p-4 ring-1 ring-berry/25">
                    <h3 className="text-sm font-bold text-berry-ink">Excluir da biblioteca</h3>
                    <p className="mt-1 text-sm text-ink-800/85">
                        {isInUse
                            ? `Não é possível excluir: ${usageCount === 1 ? 'um conteúdo usa' : `${usageCount} conteúdos usam`} este arquivo. Troque a imagem deles antes.`
                            : 'O arquivo sai da biblioteca e do servidor. Não dá para desfazer.'}
                    </p>
                    {/* A contagem vem com o arquivo, então o botão já nasce no
                        estado certo. Se outra pessoa usar o arquivo neste meio
                        tempo, o servidor ainda recusa a exclusão: a checagem
                        daqui evita o erro comum, a do servidor garante a regra. */}
                    <Button
                        variant="danger"
                        fullWidth
                        className="mt-3"
                        disabled={isInUse}
                        onClick={() => onRequestDelete(file)}
                    >
                        Excluir arquivo
                    </Button>
                </section>
            </div>
        </Modal>
    );
}
