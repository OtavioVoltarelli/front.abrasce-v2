import { useId, useState } from 'react';
import Button from '../ui/Button';
import FileThumbnail from './FileThumbnail';
import MediaPicker from './MediaPicker';
import { fileKind, isImage } from '../../lib/fileKind';
import { fileUrl } from '../../services/config';

/**
 * Campo de formulário que escolhe um arquivo da biblioteca reutilizável.
 * ---------------------------------------------------------------------------
 * É o par do `MediaPicker`: o picker é a janela de escolha, este é o campo que
 * mostra o resultado e abre a janela. Separá-los é o que permite reaproveitar
 * a escolha em qualquer formulário — hoje a capa da notícia, amanhã a imagem
 * de um projeto — mudando só `label` e `kind`.
 *
 * O valor deste campo é o OBJETO do arquivo (`ReusableFileOutput`), não o id.
 * O formulário precisa do objeto para desenhar a pré-visualização e o nome; na
 * hora de salvar, ele manda só o `id`, que é o que o `NewsInput.coverImageId`
 * espera. Guardar só o id obrigaria uma segunda busca só para mostrar a
 * miniatura do que já está selecionado.
 *
 * Estado vazio, estado preenchido e estado de erro são TRÊS desenhos
 * diferentes — não é o mesmo bloco com um texto trocado. Um campo obrigatório
 * vazio precisa parecer um convite; preenchido, precisa parecer uma
 * confirmação.
 */
export default function MediaField({
    id,
    label,
    hint,
    required = false,
    value,
    onChange,
    error,
    kind = 'image',
    pickerTitle,
}) {
    const labelId = useId();
    const hintId = useId();
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const noun = kind === 'image' ? 'imagem' : 'arquivo';

    return (
        <div id={id} role="group" aria-labelledby={labelId} aria-describedby={hint ? hintId : undefined}>
            <p id={labelId} className="text-sm font-semibold text-ink-900">
                {label}
                {required && (
                    <>
                        {' '}
                        <span aria-hidden="true" className="text-berry-ink">*</span>
                        <span className="sr-only">(obrigatório)</span>
                    </>
                )}
            </p>
            {hint && (
                <p id={hintId} className="mt-1 text-xs text-muted">
                    {hint}
                </p>
            )}

            <div className="mt-3">
                {value ? (
                    <div
                        className={`overflow-hidden rounded-xl ring-1 ${
                            error ? 'ring-2 ring-berry' : 'ring-line'
                        }`}
                    >
                        {isImage(value) ? (
                            <img
                                src={fileUrl('admin', value.storedName)}
                                alt=""
                                className="aspect-[16/9] w-full bg-sand object-cover"
                            />
                        ) : null}

                        <div className="flex items-center gap-3 bg-white p-3">
                            <span className="size-11 shrink-0 overflow-hidden rounded-lg">
                                <FileThumbnail file={value} iconClassName="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-xs text-muted">
                                    {kind === 'image' ? 'Imagem selecionada' : 'Arquivo selecionado'}
                                </span>
                                <span className="block truncate text-sm font-semibold text-ink-900">
                                    {value.name}
                                </span>
                                <span className="block truncate text-xs text-muted">
                                    {value.originalName} · {fileKind(value).singular}
                                </span>
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-line bg-sand p-3 sm:flex-row">
                            <Button
                                variant="secondary"
                                fullWidth
                                className="sm:w-auto"
                                onClick={() => setIsPickerOpen(true)}
                            >
                                Trocar {noun}
                            </Button>
                            {/* Remover só existe quando o campo é opcional. Num
                                campo obrigatório, "remover" só cria um estado
                                inválido que a pessoa vai ter que desfazer. */}
                            {!required && (
                                <Button variant="ghost" fullWidth className="sm:w-auto" onClick={() => onChange(null)}>
                                    Remover
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsPickerOpen(true)}
                        className={`flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-sand p-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50 ${
                            error ? 'border-berry' : 'border-line'
                        }`}
                    >
                        <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-line">
                            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <circle cx="8.5" cy="9.5" r="1.6" />
                                <path d="m4 17 4.5-4.5 3 3L15 12l5 5" />
                            </svg>
                        </span>
                        <span className="text-[0.9375rem] font-semibold text-ink-900">
                            Selecionar {noun}
                        </span>
                        <span className="text-xs text-muted">
                            Escolha da biblioteca de arquivos ou envie uma nova
                        </span>
                    </button>
                )}
            </div>

            {error && (
                <p role="alert" className="mt-2 text-sm font-semibold text-berry-ink">
                    {error}
                </p>
            )}

            <MediaPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={onChange}
                selectedId={value?.id ?? null}
                kind={kind}
                title={pickerTitle ?? `Selecionar ${noun}`}
            />
        </div>
    );
}
