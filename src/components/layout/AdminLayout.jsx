import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { cn } from '../../lib/cn';
import { ADMIN_NAV } from '../../lib/adminNavigation';
import TriangleMark from '../ui/TriangleMark';
import { accentVars } from '../../lib/palette';

/**
 * Moldura do painel administrativo.
 *
 * ---------------------------------------------------------------------------
 * A DECISÃO PRINCIPAL: BARRA INFERIOR NO CELULAR
 * ---------------------------------------------------------------------------
 * O painel público usa menu hambúrguer; o painel administrativo, não. A razão
 * é o uso: no site, a pessoa entra numa página e lê. No painel, ela pula entre
 * as seções o tempo todo — vê os contatos, confere um processo, volta.
 *
 * Menu hambúrguer custa DOIS toques (abrir + escolher) e esconde onde você
 * está. Barra inferior custa UM toque, mostra a seção atual o tempo todo, e
 * fica na parte da tela que o polegar alcança sem reposicionar a mão. Num
 * celular de 6 polegadas, o topo da tela é a região mais difícil de alcançar —
 * e é exatamente onde o hambúrguer mora.
 *
 * A partir de 1024px a barra vira uma coluna lateral: no desktop existe espaço
 * de sobra na horizontal, e o mouse alcança qualquer canto igualmente.
 *
 * CADA SEÇÃO TEM UMA COR, e ela aparece quando o item está ativo. No celular
 * não cabe uma trilha de navegação ("Painel > Notícias > Editar"), então a cor
 * é o que responde "onde eu estou?" sem ocupar espaço nenhum. São as mesmas
 * cores do site público — Processos verde, Notícias coral, Contatos turquesa.
 *
 * `pb-[env(safe-area-inset-bottom)]` afasta a barra da faixa de gestos do
 * iPhone. Sem isso, o último item fica embaixo da barrinha do sistema e o
 * toque abre o multitarefa em vez do link.
 */
export default function AdminLayout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    /* UMA função de classes serve às cinco seções, apesar de cada uma ter a sua
       cor. O truque é que a cor não está na classe: `bg-[var(--accent-tint)]` é
       sempre a mesma string, e o VALOR de `--accent-tint` é injetado no `style`
       de cada NavLink. É o mesmo mecanismo das seis áreas de atuação — e é
       obrigatório, porque o Tailwind procura classes escritas por extenso no
       código-fonte e uma classe concatenada em tempo de execução nunca é
       encontrada: ela simplesmente não existe no CSS final. */
    const itemClasses = ({ isActive }) =>
        cn(
            /* 10px na tela mais estreita, 11px a partir de 360px.
               Motivo medido: em 320px cada célula tem 64px, e "Candidatos"
               a 11px ocupa ~57px — mais que os 56px úteis depois do padding.
               O rótulo quebraria em duas linhas ou vazaria. */
            'flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[0.625rem] font-semibold transition-colors min-[360px]:text-[0.6875rem]',
            'lg:flex-row lg:justify-start lg:gap-3 lg:px-4 lg:py-3 lg:text-sm',
            isActive
                ? 'bg-[var(--accent-tint)] text-[var(--accent-ink)] lg:bg-[var(--accent-ink)] lg:text-white'
                : 'text-muted hover:text-ink-900 lg:hover:bg-sand lg:hover:text-ink-900'
        );

    return (
        <div className="min-h-dvh bg-sand lg:flex">
            {/* ------------------------------------------ COLUNA (desktop) -- */}
            <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:flex lg:flex-col">
                <div className="flex h-16 items-center gap-2 border-b border-line px-5">
                    <TriangleMark aria-hidden="true" className="h-4 w-4 text-brand-600" />
                    <span className="font-display text-sm font-bold tracking-tight text-ink-900">
                        Painel ABRASCE
                    </span>
                </div>

                <nav aria-label="Seções do painel" className="flex-1 space-y-1 p-3">
                    {ADMIN_NAV.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            style={accentVars(item.accent)}
                            className={itemClasses}
                        >
                            <span className="size-5 shrink-0">{item.icon}</span>
                            {item.fullLabel ?? item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-line p-3">
                    {/* <Link>, não <a href>: dentro de um app de página única,
                        o <a> recarrega o site inteiro (baixa o HTML, o CSS e o
                        JavaScript de novo). O <Link> só troca a tela. */}
                    <Link
                        to="/"
                        className="flex min-h-11 items-center gap-3 rounded-xl px-4 text-sm font-semibold text-muted transition-colors hover:bg-sand hover:text-ink-900"
                    >
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                        </svg>
                        Ver o site
                    </Link>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* -------------------------------------- TOPO (celular) -- */}
                <header className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
                    <div className="flex h-14 items-center justify-between px-4">
                        {/* O título é o caminho de volta para o Início, que saiu
                            da barra inferior para abrir espaço à sexta seção.
                            Logotipo que leva à página inicial é a convenção mais
                            antiga da web — não precisa ser ensinada. */}
                        <Link
                            to="/admin"
                            className="-ml-2 flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-sand"
                        >
                            <TriangleMark aria-hidden="true" className="h-3.5 w-3.5 text-brand-600" />
                            <span className="font-display text-sm font-bold tracking-tight text-ink-900">
                                Painel ABRASCE
                            </span>
                        </Link>
                        <Link
                            to="/"
                            className="-mr-2 flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-muted"
                        >
                            Ver o site
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* `pb-24` no celular reserva o espaço da barra inferior fixa.
                    Sem isso, o último botão de cada tela fica embaixo dela. */}
                <main className="flex-1 pb-24 lg:pb-0">
                    <Outlet />
                </main>
            </div>

            {/* --------------------------------------- BARRA INFERIOR (celular) */}
            <nav
                aria-label="Seções do painel"
                className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
            >
                <ul className="grid grid-cols-5">
                    {ADMIN_NAV.filter((item) => item.inBottomBar !== false).map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                style={accentVars(item.accent)}
                                className={itemClasses}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className="size-5.5 shrink-0">{item.icon}</span>
                                        <span className="w-full truncate text-center leading-none">
                                            {item.label}
                                        </span>
                                        {isActive && <span className="sr-only">(seção atual)</span>}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
