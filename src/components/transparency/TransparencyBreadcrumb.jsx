/**
 * Trilha de navegação ("Documentos > Sede > Balanços").
 *
 * Cada nível é um botão, não só o último. É o que substitui o botão "voltar"
 * de uma pilha de telas: no celular, voltar nível por nível até a raiz custa
 * um toque por nível — a trilha resolve em um toque só, direto pro nível que
 * importa.
 *
 * `overflow-x-auto` sem quebra de linha: uma trilha de seis níveis não pode
 * empurrar a tela pra baixo, e nunca pode criar rolagem HORIZONTAL na
 * PÁGINA — só dentro da própria trilha, como o índice de áreas da página
 * Projetos já faz.
 */
export default function TransparencyBreadcrumb({ crumbs, onNavigate }) {
    return (
        <nav aria-label="Caminho da pasta" className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ol className="flex items-center whitespace-nowrap text-sm">
                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <li key={crumb.id ?? 'root'} className="flex items-center">
                            {index > 0 && (
                                <svg aria-hidden="true" viewBox="0 0 20 20" className="mx-0.5 size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m7.5 5 5 5-5 5" />
                                </svg>
                            )}
                            <button
                                type="button"
                                onClick={() => onNavigate(index)}
                                disabled={isLast}
                                className={
                                    isLast
                                        ? 'min-h-9 rounded-lg px-2 font-bold text-ink-900'
                                        : 'min-h-9 rounded-lg px-2 font-semibold text-muted transition-colors hover:bg-sand hover:text-ink-900'
                                }
                            >
                                {crumb.name}
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
