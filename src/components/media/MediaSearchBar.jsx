import { useId } from 'react';
import { FILE_KINDS } from '../../lib/fileKind';
import { accentVars } from '../../lib/palette';

/**
 * Busca por nome + filtro por tipo da biblioteca.
 *
 * Um componente só porque a barra aparece em dois lugares — a tela da
 * biblioteca e o seletor de mídia — e as duas precisam se comportar igual.
 *
 * Detalhes que só aparecem no celular:
 * · `type="search"` faz o teclado do iPhone mostrar a tecla "Buscar" em vez de
 *   "Enter", e o Android desenha uma lupa. É informação de graça.
 * · O X de limpar é um <button> de 44px, e não o X nativo do `type="search"`,
 *   que só existe no Chrome de desktop e tem uns 12px.
 * · A busca roda sozinha, sem botão "Buscar", mas no SERVIDOR: quem usa este
 *   componente passa o termo por `useDebouncedValue` antes de buscar, para
 *   uma palavra digitada virar uma requisição, e não uma por letra.
 * · Os tipos rolam na horizontal DENTRO da própria barra. É o único lugar do
 *   projeto onde rolagem horizontal é aceitável: ela está contida, e o
 *   primeiro e o último item encostam na margem, sinalizando que continua.
 */
export default function MediaSearchBar({
    search,
    onSearchChange,
    kindFilter,
    onKindFilterChange,
    showKindFilter = true,
    resultCount,
    isUpdating = false,
}) {
    const inputId = useId();
    const options = [{ id: 'all', label: 'Todos', accent: 'brand' }, ...FILE_KINDS];

    return (
        <div className="space-y-3">
            <div className="relative">
                <label htmlFor={inputId} className="sr-only">
                    Buscar arquivo pelo nome
                </label>
                <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                    </svg>
                </span>
                <input
                    id={inputId}
                    type="search"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Buscar por nome…"
                    /* text-base = 16px. Abaixo disso o Safari do iPhone dá zoom
                       sozinho ao focar o campo e o layout sai do lugar. */
                    className="min-h-12 w-full rounded-xl border-0 bg-white py-2 pl-11 pr-12 text-base text-ink-900 ring-1 ring-inset ring-line placeholder:text-muted focus:ring-2 focus:ring-brand-600"
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:bg-sand hover:text-ink-900"
                    >
                        <span className="sr-only">Limpar busca</span>
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {showKindFilter && (
                <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {options.map((option) => {
                        const isActive = kindFilter === option.id;
                        return (
                            <li key={option.id}>
                                <button
                                    type="button"
                                    onClick={() => onKindFilterChange(option.id)}
                                    aria-pressed={isActive}
                                    style={accentVars(option.accent)}
                                    className={`flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-[var(--accent-ink)] text-white'
                                            : 'bg-sand text-ink-800 hover:bg-[var(--accent-tint)] hover:text-[var(--accent-ink)]'
                                    }`}
                                >
                                    {option.icon && <span aria-hidden="true" className="size-4">{option.icon}</span>}
                                    {option.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* `aria-live`: quem usa leitor de tela precisa ouvir que a lista
                mudou depois de digitar. Sem isso, a busca funciona em silêncio. */}
            <p aria-live="polite" className="text-xs text-muted">
                {isUpdating
                    ? 'Buscando…'
                    : `${resultCount === 1 ? '1 arquivo' : `${resultCount} arquivos`}${search ? ` para "${search}"` : ''}`}
            </p>
        </div>
    );
}
