import { Link } from 'react-router-dom';
import AdminPage from '../../components/admin/AdminPage';
import Skeleton from '../../components/feedback/Skeleton';
import { ADMIN_NAV } from '../../lib/adminNavigation';
import { useAllRecruitmentProcesses } from '../../hooks/useRecruitmentProcess';
import { useAllNews } from '../../hooks/useNews';

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
    };

    const sections = ADMIN_NAV.filter((item) => item.to !== '/admin');

    return (
        <AdminPage
            title="Painel da ABRASCE"
            description="Gerencie processos seletivos, notícias, candidatos e contatos."
        >
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {sections.map((section) => {
                    const count = counts[section.to];
                    const hasCount = section.to in counts;
                    const isLoadingCount = hasCount && count === undefined;

                    return (
                        <li key={section.to}>
                            <Link
                                to={section.to}
                                className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:p-5"
                            >
                                <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                    <span className="size-5.5">{section.icon}</span>
                                </span>

                                <span className="mt-3 font-display text-base font-bold leading-tight text-ink-900 sm:text-lg">
                                    {section.fullLabel ?? section.label}
                                </span>

                                {isLoadingCount ? (
                                    <Skeleton className="mt-2 h-4 w-24" />
                                ) : hasCount ? (
                                    <span className="mt-2 text-xs text-muted">
                                        <strong className="text-sm text-brand-700">{count.value}</strong>{' '}
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

            <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-line">
                <h2 className="text-base font-bold text-ink-900">Sobre este painel</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                    Nesta etapa o painel trabalha com <strong>dados de demonstração</strong>: as
                    alterações valem enquanto a página estiver aberta e somem ao recarregar. É de
                    propósito — serve para testar as telas antes de ligar no servidor.
                </p>
            </div>
        </AdminPage>
    );
}
