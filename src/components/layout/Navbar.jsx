import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { PUBLIC_NAV } from '../../lib/navigation';
import Container from '../ui/Container';
import Logo from './Logo';

/**
 * Navegação principal.
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU EM RELAÇÃO À NAVBAR ANTIGA, E POR QUÊ
 * ---------------------------------------------------------------------------
 * A versão anterior fazia isto:
 *
 *     const menu = document.getElementById('options');
 *     if (window.innerWidth >= 768) menu.style.display = 'block';
 *
 * Três problemas, do mais grave ao menos:
 *
 *  1. Ela mexia no DOM na mão. Em React, quem decide o que aparece na tela é
 *     o estado — `document.getElementById(...).style` passa por cima disso, e
 *     na próxima renderização o React sobrescreve tudo. É a origem de bugs do
 *     tipo "às vezes o menu não abre".
 *  2. Ela usava JavaScript para uma decisão de LAYOUT ("é celular ou desktop?").
 *     Isso é trabalho de media query no CSS: o CSS resolve antes da primeira
 *     pintura, o JavaScript só depois — daí o menu piscar ao carregar.
 *  3. Um `resize` listener rodando a cada pixel de redimensionamento.
 *
 * Aqui: o CSS decide o que aparece (`hidden md:flex` / `md:hidden`), e o
 * estado do React guarda só uma coisa — se a gaveta está aberta.
 *
 * O SINAL QUE DENUNCIAVA: se você escreveu `document.getElementById` dentro de
 * um componente React, quase sempre existe uma forma melhor.
 */
export default function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Enquanto a gaveta está aberta: ESC fecha e a página de trás não rola.
    useEffect(() => {
        if (!isDrawerOpen) return undefined;

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event) => event.key === 'Escape' && setIsDrawerOpen(false);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = overflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isDrawerOpen]);

    const linkClasses = ({ isActive }) =>
        cn(
            'relative flex items-center rounded-lg px-3 py-2 text-[0.8125rem] font-semibold uppercase tracking-wide transition-colors',
            isActive ? 'text-brand-700' : 'text-ink-800 hover:text-brand-600'
        );

    return (
        <>
            {/* "Pular para o conteúdo": o primeiro elemento focável da página.
                Fica invisível até receber foco pelo teclado. Sem ele, quem
                navega por teclado passa pelos 6 itens do menu em TODA página
                antes de chegar no conteúdo. */}
            <a
                href="#conteudo"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2.5 focus:font-semibold focus:text-white"
            >
                Pular para o conteúdo
            </a>

            <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
                <Container size="wide">
                    <nav className="flex h-16 items-center justify-between gap-4 sm:h-18" aria-label="Navegação principal">
                        <Logo />

                        {/* DESKTOP — a partir de 1024px. Entre 768 e 1024 os seis
                            itens não cabem sem apertar, então a gaveta continua. */}
                        <ul className="hidden items-center gap-0.5 lg:flex">
                            {PUBLIC_NAV.map((item) => (
                                <li key={item.to}>
                                    <NavLink to={item.to} end={item.to === '/'} className={linkClasses}>
                                        {({ isActive }) => (
                                            <>
                                                {item.label}
                                                {/* A marca da página atual é uma barra, não só
                                                    a cor: quem não distingue bem cores precisa
                                                    de um segundo sinal. */}
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600 transition-opacity',
                                                        isActive ? 'opacity-100' : 'opacity-0'
                                                    )}
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* CELULAR E TABLET */}
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(true)}
                            aria-expanded={isDrawerOpen}
                            aria-controls="menu-mobile"
                            className="-mr-2 grid size-11 place-items-center rounded-xl text-ink-900 transition-colors hover:bg-sand lg:hidden"
                        >
                            <span className="sr-only">Abrir o menu de navegação</span>
                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        </button>
                    </nav>
                </Container>
            </header>

            {/* ---------------- GAVETA (celular e tablet) ---------------- */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Fechar o menu"
                        onClick={() => setIsDrawerOpen(false)}
                        className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50 backdrop-blur-[2px]"
                    />

                    {/* Entra pela DIREITA: é o lado onde o polegar já está.
                        `max-w-sm` deixa uma faixa da página visível à esquerda,
                        o que comunica "isto é uma camada, dá para voltar". */}
                    <div
                        id="menu-mobile"
                        className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-lift motion-safe:animate-[slideIn_220ms_ease-out]"
                    >
                        <div className="flex h-16 items-center justify-between border-b border-line px-5">
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Menu</span>
                            <button
                                type="button"
                                onClick={() => setIsDrawerOpen(false)}
                                className="-mr-2 grid size-11 place-items-center rounded-xl text-ink-900 transition-colors hover:bg-sand"
                            >
                                <span className="sr-only">Fechar o menu</span>
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Fecha a gaveta ao tocar em qualquer link.
                            A primeira versão fazia isso com um efeito que
                            observava a rota (`useEffect(..., [pathname])`) e
                            chamava `setState` lá dentro. Funciona, mas é o
                            caminho errado: o efeito só roda DEPOIS de o React
                            pintar a tela, então existe um quadro em que a
                            página nova já está lá com a gaveta ainda por cima —
                            e cada navegação custa uma renderização extra.
                            Fechar no próprio clique é direto, e o clique é a
                            causa real do fechamento.
                            A regra do ESLint que apontou isso é a
                            `react-hooks/set-state-in-effect`; vale ler o aviso
                            dela inteiro, é uma boa aula. */}
                        <ul className="flex-1 overflow-y-auto p-3" onClick={() => setIsDrawerOpen(false)}>
                            {PUBLIC_NAV.map((item) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end={item.to === '/'}
                                        className={({ isActive }) =>
                                            cn(
                                                /* min-h-13 = 52px. Item de menu é o alvo
                                                   mais tocado do site; vale ser generoso. */
                                                'flex min-h-13 items-center gap-3 rounded-xl px-4 text-[0.9375rem] font-semibold transition-colors',
                                                isActive
                                                    ? 'bg-brand-50 text-brand-700'
                                                    : 'text-ink-800 active:bg-sand'
                                            )
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'h-6 w-1 rounded-full transition-colors',
                                                        isActive ? 'bg-brand-600' : 'bg-transparent'
                                                    )}
                                                />
                                                {item.label}
                                                {isActive && <span className="sr-only">(página atual)</span>}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
