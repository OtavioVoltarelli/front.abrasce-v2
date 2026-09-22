import { fileKind } from '../../lib/fileKind';
import { accentVars } from '../../lib/palette';
import { isFolderNode } from '../../hooks/useTransparency';
import { transparencyFileUrl } from '../../services/transparencyService';

/** Mesma moldura de "folha com canto dobrado" do resto do painel
 *  (`lib/fileKind.jsx`), só que fechada — visualmente aparentada, mas
 *  ninguém confunde pasta com arquivo. */
function FolderIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8h9a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
        </svg>
    );
}

/**
 * Uma linha da listagem: pasta ou arquivo, sempre com dois alvos de toque
 * separados — o corpo da linha (entrar na pasta / abrir o arquivo) e o botão
 * "⋯" (as ações de administrar). Mesma decisão MEDIDA da biblioteca de
 * arquivos (`MediaFileSheet.jsx`): dois botões com texto não cabem lado a
 * lado numa linha de 320px, e ícone sozinho sem rótulo é adivinhação para
 * quem usa o painel raramente.
 */
export default function TransparencyItemRow({ item, onEnter, onOpenActions }) {
    const isFolder = isFolderNode(item);
    const kind = isFolder ? null : fileKind({ name: item.name });

    return (
        <li className="flex items-center gap-1 rounded-xl bg-white ring-1 ring-line">
            {isFolder ? (
                <button
                    type="button"
                    onClick={() => onEnter(item.id)}
                    className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl px-3 text-left transition-colors hover:bg-sand"
                >
                    <span style={accentVars('sun')} aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--accent-tint)] text-[var(--accent-ink)]">
                        <FolderIcon />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-900">{item.name}</span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7.5 5 5 5-5 5" />
                    </svg>
                </button>
            ) : (
                <a
                    href={transparencyFileUrl(item.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-sand"
                >
                    <span style={accentVars(kind.accent)} aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--accent-tint)] text-[var(--accent-ink)]">
                        {kind.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink-900">{item.name}</span>
                        <span className="block text-xs text-muted">Abre em uma nova aba</span>
                    </span>
                </a>
            )}

            <button
                type="button"
                onClick={() => onOpenActions(item)}
                aria-label={`Opções de ${item.name}`}
                className="grid size-11 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-ink-900"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                </svg>
            </button>
        </li>
    );
}
