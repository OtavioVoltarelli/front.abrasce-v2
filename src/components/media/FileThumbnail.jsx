import { cn } from '../../lib/cn';
import { fileUrl } from '../../services/config';
import { fileKind } from '../../lib/fileKind';
import { accentVars } from '../../lib/palette';

/**
 * Miniatura de um arquivo da biblioteca.
 *
 * Imagem vira imagem; qualquer outro tipo vira um ícone sobre o fundo colorido
 * do seu tipo. A alternativa preguiçosa seria um ícone cinza igual para tudo —
 * e aí, numa grade de trinta arquivos, distinguir PDF de planilha exigiria ler
 * trinta nomes.
 *
 * Aceita tanto um `ReusableFileOutput` (o que veio do servidor) quanto um
 * `File` do navegador com `previewUrl` (o que a pessoa acabou de escolher e
 * ainda não subiu). Os dois passam pela mesma classificação, então a
 * pré-visualização do upload já mostra exatamente o que a biblioteca vai
 * mostrar depois de salvar.
 *
 * `alt=""` de propósito: em todos os usos existe um texto ao lado com o nome
 * do arquivo. Descrever a imagem de novo faria o leitor de tela ler duas vezes.
 */
export default function FileThumbnail({ file, previewUrl, className, iconClassName }) {
    const kind = fileKind(file);
    const source = previewUrl ?? (kind.id === 'image' ? fileUrl('admin', file?.storedName) : null);

    if (source) {
        return (
            <img
                src={source}
                alt=""
                loading="lazy"
                decoding="async"
                className={cn('size-full bg-sand object-cover', className)}
            />
        );
    }

    return (
        <span
            style={accentVars(kind.accent)}
            className={cn(
                'grid size-full place-items-center bg-[var(--accent-tint)] text-[var(--accent-ink)]',
                className
            )}
        >
            <span aria-hidden="true" className={cn('size-8', iconClassName)}>
                {kind.icon}
            </span>
        </span>
    );
}
