import { Link } from 'react-router-dom';
import AdminPage from '../../components/admin/AdminPage';
import Skeleton from '../../components/feedback/Skeleton';
import { ADMIN_NAV } from '../../lib/adminNavigation';
import { accentVars } from '../../lib/palette';
import { useAllRecruitmentProcesses } from '../../hooks/useRecruitmentProcess';
import { useAllNews } from '../../hooks/useNews';
import { useReusableFiles } from '../../hooks/useReusableFiles';

/**
 * Tela inicial do painel.
 *
 * Cartões grandes, um por seção. No celular ficam em duas colunas — grandes o
 * suficiente para o dedo, e ainda assim as quatro seções cabem sem rolagem.
 *
 * Cada cartão mostra um NÚMERO ao lado do nome. Isso é o que transforma a tela
 * de um menu redundante (a barra inferior já leva às mesmas seções) em algo
 * útil: abrindo o painel, a pessoa já vê que há 4 processos abertos e 7
 * notícias publicadas, sem precisar entrar em nada.
 */
export default function AdminDashboard() {
    const processes = useAllRecruitmentProcesses();
    const news = useAllNews();
    const files = useReusableFiles();

    // Contagem por seção. `undefined` = ainda carregando; o cartão mostra um
    // esqueleto no lugar do número em vez de piscar "0" e depois corrigir.
    const counts = {
        '/admin/processos-seletivos': processes.data
            ? {
                value: processes.data.filter((process) => process.active).length,
                label: 'com inscrições abertas',
            }
            : undefined,
        '/admin/noticias': news.data
            ? { value: news.data.length, label: news.data.length === 1 ? 'publicada' : 'publicadas' }
            : undefined,
        '/admin/arquivos': files.data
            ? { value: files.data.length, label: files.data.length === 1 ? 'na biblioteca' : 'na biblioteca' }
            : undefined,
    };

    const sections = ADMIN_NAV.filter((item) => item.to !== '/admin');

    return (
        <AdminPage
            title="Painel da ABRASCE"
            description="Gerencie processos seletivos, notícias, candidatos e contatos."
        >
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                {sections.map((section) => {
                    const count = counts[section.to];
                    const hasCount = section.to in counts;
                    const isLoadingCount = hasCount && count === undefined;

                    return (
                        <li key={section.to}>
                            <Link
                                to={section.to}
                                style={accentVars(section.accent)}
                                className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:p-5"
                            >
                                {/* O ícone leva a cor da seção — a MESMA que a
                                    barra inferior acende quando você entra nela.
                                    Quatro cartões azuis idênticos obrigam a ler
                                    os quatro rótulos; quatro cores diferentes
                                    são reconhecidas antes da leitura. */}
                                <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-[var(--accent-tint)] text-[var(--accent-ink)]">
                                    <span className="size-5.5">{section.icon}</span>
                                </span>

                                <span className="mt-3 font-display text-base font-bold leading-tight text-ink-900 sm:text-lg">
                                    {section.fullLabel ?? section.label}
                                </span>

                                {isLoadingCount ? (
                                    <Skeleton className="mt-2 h-4 w-24" />
                                ) : hasCount ? (
                                    <span className="mt-2 text-xs text-muted">
                                        <strong className="text-sm text-[var(--accent-ink)]">{count.value}</strong>{' '}
                                        {count.label}
                                    </span>
                                ) : (
                                    <span className="mt-2 text-xs text-muted">{section.description}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Aviso, não conteúdo: fundo âmbar, a cor que o site usa para
                "preste atenção nisto" (é a mesma da página de erro 404). */}
            <div className="mt-8 rounded-2xl bg-sun-tint p-5 ring-1 ring-sun/25">
                <h2 className="text-base font-bold text-sun-ink">Sobre este painel</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-800/85">
                    Nesta etapa o painel trabalha com <strong>dados de demonstração</strong>: as
                    alterações valem enquanto a página estiver aberta e somem ao recarregar. É de
                    propósito — serve para testar as telas antes de ligar no servidor.
                </p>
            </div>
        </AdminPage>
    );
}
