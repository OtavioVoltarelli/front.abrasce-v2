import { useId, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { formatFileSize } from '../../lib/format';

/**
 * Envio de arquivo.
 *
 * O <input type="file"> nativo é o pior componente do HTML: o botão é minúsculo,
 * o rótulo ("Escolher arquivo / Nenhum arquivo") não dá para traduzir nem
 * estilizar, e no celular vira um alvo de toque de 20px.
 *
 * A solução padrão é: manter o input nativo (ele faz o trabalho de verdade e
 * é acessível), escondê-lo com `sr-only` — que o tira da tela mas NÃO do
 * teclado nem do leitor de tela, ao contrário de `display:none` — e envolvê-lo
 * num <label> grande e bonito. Tocar em qualquer lugar do label aciona o
 * input, porque é para isso que serve um label.
 *
 * Arrastar-e-soltar é um extra do desktop. Nunca é o ÚNICO caminho: no celular
 * não existe arrastar arquivo, então o toque precisa resolver tudo sozinho.
 */
/*
 * `accept` não tem valor padrão de propósito: cada upload pertence a uma
 * categoria do backend com a sua lista (`lib/uploadRules`), e quem usa o
 * componente é quem sabe qual é. Um padrão aqui já mascarou o problema uma
 * vez — anexos de notícia ofereciam só PDF e Word por herdarem o padrão do
 * currículo.
 */
export default function FileUpload({
    id: idProp,
    label,
    hint,
    error,
    required,
    accept,
    maxSizeMb = 1,
    value,
    onChange,
    className,
}) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

    const handleFiles = (files) => {
        const file = files?.[0];
        if (file) onChange(file);
    };

    const clear = () => {
        onChange(null);
        // Zerar o valor do input nativo também: sem isso, escolher o MESMO
        // arquivo de novo não dispara `change` (o valor não mudou) e a pessoa
        // acha que o site travou.
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <span className="text-sm font-semibold text-ink-800">
                {label}
                {required && <span className="ml-1 font-normal text-muted">(obrigatório)</span>}
            </span>

            {hint && (
                <p id={`${id}-hint`} className="text-xs text-muted">
                    {hint}
                </p>
            )}

            {value ? (
                <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-3 ring-1 ring-inset ring-brand-200">
                    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2v6h6M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                        {/* `truncate` + `min-w-0`: um nome de arquivo comprido
                            empurraria o botão de remover para fora da tela. */}
                        <span className="block truncate text-sm font-semibold text-ink-900">{value.name}</span>
                        <span className="block text-xs text-muted">{formatFileSize(value.size)}</span>
                    </span>
                    <button
                        type="button"
                        onClick={clear}
                        className="grid size-11 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-white hover:text-red-700"
                        aria-label={`Remover o arquivo ${value.name}`}
                    >
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsDragging(false);
                        handleFiles(event.dataTransfer.files);
                    }}
                    className={cn(
                        'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-5 py-7 text-center transition-colors',
                        'focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-brand-600',
                        error
                            ? 'border-red-400 bg-red-50'
                            : isDragging
                                ? 'border-brand-600 bg-brand-50'
                                : 'border-line bg-sand hover:border-brand-400 hover:bg-brand-50'
                    )}
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                    <span className="text-sm font-semibold text-brand-700">
                        Toque para escolher um arquivo
                    </span>
                    <span className="text-xs text-muted">
                        <span className="hidden sm:inline">ou arraste até aqui · </span>
                        PDF ou Word · até {maxSizeMb} MB
                    </span>
                    <input
                        ref={inputRef}
                        id={id}
                        type="file"
                        accept={accept}
                        className="sr-only"
                        aria-describedby={describedBy}
                        aria-invalid={Boolean(error) || undefined}
                        onChange={(event) => handleFiles(event.target.files)}
                    />
                </label>
            )}

            {error && (
                <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-sm font-medium text-red-700">
                    <span aria-hidden="true">⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
}
