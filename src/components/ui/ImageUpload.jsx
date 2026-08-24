import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { formatFileSize } from '../../lib/format';

/**
 * Escolha da imagem de capa, com PRÉ-VISUALIZAÇÃO.
 *
 * Ver a imagem antes de salvar não é enfeite: a capa é o elemento mais visível
 * da notícia no site, e "IMG_20260814_193045.jpg" não diz nada sobre se a foto
 * está de lado, escura ou cortada. A miniatura responde isso em um olhar.
 *
 * ---------------------------------------------------------------------------
 * O CUIDADO COM `URL.createObjectURL`
 * ---------------------------------------------------------------------------
 * Ela cria um endereço temporário que aponta para o arquivo na memória do
 * navegador. Esse endereço só é liberado quando alguém chama `revokeObjectURL`
 * ou a aba fecha. Sem a limpeza no `useEffect`, cada troca de imagem deixaria
 * a anterior presa na memória — e trocar dez fotos de 3 MB numa sessão trava
 * um celular modesto. É um vazamento de memória silencioso, dos mais comuns
 * em formulários com upload.
 *
 * A proporção 16/9 da moldura é a MESMA usada no card e na página da notícia.
 * Assim o corte que a pessoa vê aqui é o corte que vai para o ar.
 */
export default function ImageUpload({
    label,
    hint,
    error,
    required,
    currentImageUrl,
    value,
    onChange,
    className,
}) {
    const id = useId();
    const inputRef = useRef(null);
    /* Deriva a URL de pré-visualização DURANTE a renderização, comparando o
       arquivo atual com o que gerou a URL anterior. É o mesmo padrão do
       FlashMessage: ajustar estado no meio do render quando uma entrada mudou.
       Fazer isso num `useEffect` custaria um quadro sem imagem e uma
       renderização extra — e o ESLint aponta
       (`react-hooks/set-state-in-effect`). */
    const [previewSource, setPreviewSource] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    if (value !== previewSource) {
        setPreviewSource(value);
        setPreviewUrl(value ? URL.createObjectURL(value) : null);
    }

    /* O efeito faz UMA coisa: devolver a memória. Quando `previewUrl` muda, a
       função de limpeza roda com o valor ANTIGO no fecho e libera aquele; ao
       desmontar, libera o atual. É para isto que efeito serve — cuidar de um
       recurso que vive fora do React. */
    useEffect(() => {
        if (!previewUrl) return undefined;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const shownImage = previewUrl ?? currentImageUrl;

    const clear = () => {
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <span className="text-sm font-semibold text-ink-800">
                {label}
                {required && <span className="ml-1 font-normal text-muted">(obrigatório)</span>}
            </span>
            {hint && <p className="text-xs text-muted">{hint}</p>}

            {shownImage ? (
                <div className="overflow-hidden rounded-xl ring-1 ring-line">
                    <img
                        src={shownImage}
                        alt="Pré-visualização da imagem de capa"
                        className="aspect-[16/9] w-full bg-sand object-cover"
                    />
                    <div className="flex flex-col gap-2 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="min-w-0 text-xs text-muted">
                            {value ? (
                                <>
                                    <span className="block truncate font-semibold text-ink-900">{value.name}</span>
                                    {formatFileSize(value.size)}
                                </>
                            ) : (
                                'Capa publicada atualmente'
                            )}
                        </span>

                        <span className="flex shrink-0 gap-2">
                            <label
                                htmlFor={id}
                                className="flex min-h-11 cursor-pointer items-center rounded-lg bg-brand-50 px-4 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-brand-600"
                            >
                                Trocar imagem
                            </label>
                            {value && (
                                <button
                                    type="button"
                                    onClick={clear}
                                    className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted transition-colors hover:bg-sand hover:text-ink-900"
                                >
                                    Cancelar
                                </button>
                            )}
                        </span>
                    </div>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    className={cn(
                        'flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 text-center transition-colors',
                        'focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-brand-600',
                        error ? 'border-red-400 bg-red-50' : 'border-line bg-sand hover:border-brand-400 hover:bg-brand-50'
                    )}
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8 text-brand-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <circle cx="8.5" cy="10" r="1.5" />
                        <path d="m4 17 4.5-4.5L12 16l3-3 5 5" />
                    </svg>
                    <span className="text-sm font-semibold text-brand-700">
                        Toque para escolher a imagem de capa
                    </span>
                    <span className="text-xs text-muted">JPG, PNG ou WebP · proporção 16:9</span>
                </label>
            )}

            <input
                ref={inputRef}
                id={id}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-invalid={Boolean(error) || undefined}
                onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            />

            {error && (
                <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-red-700">
                    <span aria-hidden="true">⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}
