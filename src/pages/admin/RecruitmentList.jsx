import { Link } from 'react-router-dom';
import AdminPage from '../../components/admin/AdminPage';
import FlashMessage from '../../components/admin/FlashMessage';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import QueryBoundary from '../../components/feedback/QueryBoundary';
import Skeleton from '../../components/feedback/Skeleton';
import LoadMore from '../../components/feedback/LoadMore';
import {
    useActiveRecruitmentProcessTotal,
    useRecruitmentProcessPages,
} from '../../hooks/useRecruitmentProcess';
import { formatShortDate, toIsoDate } from '../../lib/format';

/**
 * Listagem administrativa dos processos seletivos.
 *
 * Cards, não tabela. Uma tabela com título, data, situação e ação em 360px de
 * largura ou ganha barra de rolagem horizontal, ou espreme o título a ponto de
 * ele virar cinco linhas de uma palavra. O card empilha naturalmente.
 *
 * Cada card inteiro é o link de edição — não existe um botãozinho "Editar" de
 * 60px no canto. Alvo de toque de 100% da largura contra um de 60px não é
 * comparação; e como a única ação daqui é editar, o card pode ser o botão.
 */
const PAGE_SIZE = 20;

export default function AdminRecruitmentList() {
    const query = useRecruitmentProcessPages({ pageSize: PAGE_SIZE });
    // Contado no servidor: filtrar `active` só nas páginas carregadas
    // subcontaria os abertos que ainda estão na página 2.
    const activeTotal = useActiveRecruitmentProcessTotal();

    return (
        <AdminPage
            title="Processos seletivos"
            description="Toque em um processo para editar ou excluir."
            action={
                <Button to="/admin/processos-seletivos/novo" size="lg">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Criar processo seletivo
                </Button>
            }
        >
            <FlashMessage />

            <QueryBoundary
                query={query}
                errorTitle="Não foi possível carregar os processos seletivos"
                skeleton={
                    <ul className="space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <li key={index} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="mt-3 h-5 w-full max-w-md" />
                                <Skeleton className="mt-3 h-3 w-24" />
                            </li>
                        ))}
                    </ul>
                }
                empty={{
                    icon: (
                        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="7" width="18" height="13" rx="2" />
                            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    ),
                    title: 'Nenhum processo seletivo cadastrado',
                    description: 'Crie o primeiro processo para que ele apareça na página "Trabalhe conosco" do site.',
                    action: { label: 'Criar processo seletivo', to: '/admin/processos-seletivos/novo', variant: 'primary' },
                }}
            >
                {(processes) => (
                    <>
                        <p className="mb-4 text-sm text-muted">
                            {query.totalElements === 1 ? '1 processo' : `${query.totalElements} processos`}
                            {activeTotal.data !== undefined && ` · ${activeTotal.data} com inscrições abertas`}
                        </p>

                        <ul className="space-y-3">
                            {processes.map((process) => (
                                <li key={process.id}>
                                    <Link
                                        to={`/admin/processos-seletivos/${process.id}`}
                                        className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-shadow hover:shadow-lift sm:p-5"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {process.active ? (
                                                    <Badge tone="success">Aberto</Badge>
                                                ) : (
                                                    <Badge tone="neutral">Encerrado</Badge>
                                                )}
                                                <time
                                                    dateTime={toIsoDate(process.creationDate)}
                                                    className="text-xs text-muted"
                                                >
                                                    {formatShortDate(process.creationDate)}
                                                </time>
                                            </div>

                                            <h2 className="mt-1.5 font-display text-base font-bold leading-snug text-ink-900 sm:text-lg">
                                                {process.title}
                                            </h2>

                                            <p className="mt-1 text-xs text-muted">
                                                {process.attachments?.length
                                                    ? `${process.attachments.length} anexo(s)`
                                                    : 'Sem anexos'}
                                            </p>
                                        </div>

                                        <span
                                            aria-hidden="true"
                                            className="grid size-9 shrink-0 place-items-center rounded-lg bg-sand text-muted transition-colors group-hover:bg-brand-600 group-hover:text-white"
                                        >
                                            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M7 4l6 6-6 6" />
                                            </svg>
                                        </span>
                                        <span className="sr-only">Editar</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <LoadMore query={query} noun="processos" />
                    </>
                )}
            </QueryBoundary>
        </AdminPage>
    );
}
