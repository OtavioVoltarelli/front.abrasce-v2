import { useEffect, useId, useRef, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FileThumbnail from './FileThumbnail';
import { fileKind, isImage } from '../../lib/fileKind';
import { formatFileSize } from '../../lib/format';
import { acceptFor } from '../../lib/uploadRules';

/**
 * Enviar um arquivo para a biblioteca: escolher → conferir → nomear → salvar.
 *
 * Vive num componente próprio porque é usado em DOIS lugares: na tela da
 * biblioteca e dentro do seletor de mídia. Se estivesse escrito dentro da
 * biblioteca, quem estivesse criando uma notícia teria que abandonar o
 * formulário, ir até a biblioteca, subir a imagem e voltar — perdendo o que já
 * tinha digitado.
 *
 * ---------------------------------------------------------------------------
 * DECISÕES DE CELULAR
 * ---------------------------------------------------------------------------
 * · O <input type="file"> de verdade fica escondido e o que aparece é um
 *   <label> estilizado como botão. O controle nativo tem um botãozinho de
 *   ~100x24px que não se estiliza e é um alvo ruim para o dedo. O <label>
 *   funciona porque clicar num rótulo aciona o campo associado — sem
 *   JavaScript, e continuando acessível pelo teclado.
 * · No celular, esse mesmo controle abre a câmera e a galeria. O `accept`
 *   padrão é a lista de extensões que a biblioteca aceita (`lib/uploadRules`):
 *   o seletor não oferece o que o servidor recusaria depois do upload.
 * · Depois de escolher, o arquivo aparece com nome e tamanho. "Nenhum arquivo
 *   selecionado" é o estado que mais gera dúvida em formulário de upload.
 */
export default function MediaUploadPanel({
    accept = acceptFor('library'),
    submitLabel = 'Adicionar à biblioteca',
    isPending = false,
    error,
    onSubmit,
    onCancel,
}) {
    const inputId = useId();
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [validationError, setValidationError] = useState(null);

    /* A URL de pré-visualização é DERIVADA do arquivo escolhido. Ajustar o
       estado durante a renderização (e não dentro de um `useEffect`) é o padrão
       oficial do React para isso: o efeito só roda DEPOIS de pintar a tela, o
       que daria um quadro com a imagem antiga antes de trocar. */
    const [previewSource, setPreviewSource] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    if (file !== previewSource) {
        setPreviewSource(file);
        setPreviewUrl(file && isImage(file) ? URL.createObjectURL(file) : null);
    }

    /* Aqui o efeito é legítimo: ele fala com o mundo fora do React. Cada
       `createObjectURL` prende o arquivo na memória do navegador até alguém
       revogar — trocar de imagem cinco vezes sem isso deixa cinco arquivos
       presos. */
    useEffect(() => {
        if (!previewUrl) return undefined;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const handleFileChange = (event) => {
        const chosen = event.target.files?.[0] ?? null;
        setFile(chosen);
        setValidationError(null);
        /* Pré-preenche o rótulo com o nome do arquivo sem a extensão — a mesma
           regra que o backend aplica quando o nome vem vazio. Deixar visível o
           que o servidor faria em silêncio permite corrigir antes de salvar. */
        if (chosen && !name.trim()) {
            const dotIndex = chosen.name.lastIndexOf('.');
            setName(dotIndex > 0 ? chosen.name.slice(0, dotIndex) : chosen.name);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!file) {
            setValidationError('Escolha um arquivo para enviar.');
            inputRef.current?.focus();
            return;
        }
        onSubmit({ file, name });
    };

    const kind = fileKind(file);
    const size = formatFileSize(file?.size);

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
                <p role="alert" className="rounded-xl bg-berry-tint p-3 text-sm font-semibold text-berry-ink">
                    {error}
                </p>
            )}

            <div>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="sr-only"
                />
                <label
                    htmlFor={inputId}
                    className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-sand px-5 text-[0.9375rem] font-semibold text-ink-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V4M8 8l4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                    {file ? 'Trocar arquivo' : 'Escolher arquivo'}
                </label>
                {validationError && (
                    <p role="alert" className="mt-2 text-sm font-semibold text-berry-ink">
                        {validationError}
                    </p>
                )}
            </div>

            {/* Confirmação visível do que foi escolhido. `aria-live="polite"`
                faz o leitor de tela anunciar o arquivo assim que ele muda —
                sem isso, quem não enxerga a miniatura não recebe retorno
                nenhum de que a escolha funcionou. */}
            {file && (
                <div aria-live="polite" className="space-y-3">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt=""
                            className="aspect-[16/9] w-full rounded-xl bg-sand object-cover ring-1 ring-line"
                        />
                    ) : null}

                    <div className="flex items-center gap-3 rounded-xl bg-sand p-3 ring-1 ring-line">
                        <span className="size-11 shrink-0 overflow-hidden rounded-lg">
                            <FileThumbnail file={file} previewUrl={previewUrl} iconClassName="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink-900">
                                {file.name}
                            </span>
                            <span className="block text-xs text-muted">
                                {kind.singular}
                                {size ? ` · ${size}` : ''}
                            </span>
                        </span>
                    </div>
                </div>
            )}

            <Input
                label="Nome na biblioteca"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={255}
                hint="É por este nome que você vai encontrar o arquivo depois. Em branco, usamos o nome do arquivo."
            />

            <div className="flex flex-col gap-2 sm:flex-row-reverse">
                <Button type="submit" size="lg" fullWidth className="sm:w-auto" disabled={isPending}>
                    {isPending ? 'Enviando…' : submitLabel}
                </Button>
                {onCancel && (
                    <Button type="button" variant="secondary" size="lg" fullWidth className="sm:w-auto" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
            </div>
        </form>
    );
}
