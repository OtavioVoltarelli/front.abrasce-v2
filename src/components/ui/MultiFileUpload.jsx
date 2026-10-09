import { useId, useRef } from 'react';
import { cn } from '../../lib/cn';
import { formatFileSize } from '../../lib/format';
import { FORMATS_LABEL, MAX_FILE_SIZE_MB, MAX_REQUEST_SIZE_MB, acceptFor, exceedsMaxSize } from '../../lib/uploadRules';

/**
 * Envio de VÁRIOS arquivos — os anexos de uma notícia ou o edital de um
 * processo seletivo.
 *
 * Diferenças em relação ao `FileUpload` de arquivo único, e por que existem:
 *
 * · Escolher arquivos ACRESCENTA à lista, não substitui. No celular a pessoa
 *   costuma pegar um arquivo por vez (um do Drive, outro da galeria); se cada
 *   escolha apagasse a anterior, seria impossível montar uma lista.
 *
 * · A lista mostra os anexos QUE JÁ EXISTEM na notícia sendo editada, marcados
 *   como "já publicado". Sem isso, ao editar, a pessoa vê um campo vazio e
 *   conclui que os anexos sumiram. `existingFiles` é a lista de
 *   `StoredFileOutput` do backend (`{ storedName, originalName, contentType }`).
 *
 * · Trocar os anexos é uma ação explícita ("Substituir todos os anexos"), e não
 *   um efeito colateral de tocar no campo. O motivo é o backend: ele não sabe
 *   acrescentar um anexo, só trocar a lista inteira. Deixar isso escondido
 *   levaria a apagar anexos sem querer.
 */
/*
 * `category` (obrigatória, sem padrão) é a categoria de upload do backend —
 * `news`, `recruitmentProcess`. Dela saem o `accept`, os limites de tamanho e
 * o texto dos formatos, todos de `lib/uploadRules`.
 *
 * O componente MOSTRA qual arquivo passou do limite, mas não decide se o
 * formulário pode ser enviado: a mensagem de erro chega pronta por `error`,
 * calculada pelo formulário com `validateAttachments` — a mesma função que
 * bloqueia o envio. `id` vai no contêiner para o `scrollToFirstError` achar
 * o campo.
 */
export default function MultiFileUpload({
    id: containerId,
    label,
    hint,
    error,
    category,
    existingFiles = [],
    files,
    onChange,
    className,
}) {
    const id = useId();
    const inputRef = useRef(null);

    // `files === null` significa "não mexi nos anexos"; um array significa
    // "esta é a nova lista", inclusive quando é um array vazio.
    const isReplacing = files !== null;

    const addFiles = (fileList) => {
        const incoming = [...fileList];
        if (incoming.length === 0) return;
        onChange([...(files ?? []), ...incoming]);
        if (inputRef.current) inputRef.current.value = '';
    };

    const removeAt = (index) => onChange(files.filter((_, position) => position !== index));

    return (
        <div id={containerId} className={cn('flex flex-col gap-1.5', className)}>
            <span className="text-sm font-semibold text-ink-800">{label}</span>
            {hint && <p className="text-xs text-muted">{hint}</p>}
            <p className="text-xs text-muted">
                {FORMATS_LABEL[category]} · até {MAX_FILE_SIZE_MB[category]} MB cada, {MAX_REQUEST_SIZE_MB} MB no total
            </p>

            {/* Anexos já publicados — só aparecem enquanto não se está trocando. */}
            {!isReplacing && existingFiles.length > 0 && (
                <ul className="space-y-2">
                    {existingFiles.map((file) => (
                        <li
                            key={file.storedName}
                            className="flex items-center gap-3 rounded-xl bg-sand p-3 ring-1 ring-inset ring-line"
                        >
                            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 ring-1 ring-line">
                                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M14 2v6h6M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                </svg>
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-ink-900">
                                    {file.originalName}
                                </span>
                                <span className="block text-xs text-muted">Já publicado</span>
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Arquivos novos escolhidos agora. */}
            {isReplacing && files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((file, index) => {
                        const tooLarge = exceedsMaxSize(category, file);
                        return (
                            <li
                                key={`${file.name}-${index}`}
                                className={cn(
                                    'flex items-center gap-3 rounded-xl p-3 ring-1 ring-inset',
                                    tooLarge ? 'bg-berry-tint ring-berry/40' : 'bg-brand-50 ring-brand-200'
                                )}
                            >
                                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                        <path d="M14 2v6h6M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    </svg>
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-ink-900">{file.name}</span>
                                    {/* O tamanho continua visível no arquivo grande
                                        demais: é ele que diz à pessoa QUANTO precisa
                                        diminuir. */}
                                    <span className={cn('block text-xs', tooLarge ? 'font-semibold text-berry-ink' : 'text-muted')}>
                                        {formatFileSize(file.size)}
                                        {tooLarge && ` · passa de ${MAX_FILE_SIZE_MB[category]} MB`}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeAt(index)}
                                    aria-label={`Remover ${file.name}`}
                                    className="grid size-11 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white hover:text-red-700"
                                >
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {isReplacing && files.length === 0 && (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-inset ring-amber-200">
                    Ao salvar, esta notícia ficará <strong>sem nenhum anexo</strong>.
                </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
                {!isReplacing && existingFiles.length > 0 ? (
                    <button
                        type="button"
                        onClick={() => onChange([])}
                        className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-line transition-colors hover:bg-brand-50"
                    >
                        Substituir todos os anexos
                    </button>
                ) : (
                    <label
                        htmlFor={id}
                        className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-line transition-colors hover:bg-brand-50 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-brand-600"
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        {files?.length ? 'Adicionar mais um arquivo' : 'Escolher arquivos'}
                        <input
                            ref={inputRef}
                            id={id}
                            type="file"
                            accept={acceptFor(category)}
                            multiple
                            className="sr-only"
                            aria-invalid={Boolean(error) || undefined}
                            onChange={(event) => addFiles(event.target.files)}
                        />
                    </label>
                )}

                {isReplacing && existingFiles.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="min-h-11 rounded-xl px-4 text-sm font-semibold text-muted transition-colors hover:bg-white hover:text-ink-900"
                    >
                        Cancelar e manter os anexos atuais
                    </button>
                )}
            </div>

            {error && (
                <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-red-700">
                    <span aria-hidden="true">⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}
