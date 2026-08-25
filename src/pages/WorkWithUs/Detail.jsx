import { Link, useParams } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import { accentVars } from '../../lib/palette';
import Badge from '../../components/ui/Badge';
import RichText from '../../components/RichText';
import AttachmentList from '../../components/AttachmentList';
import CandidateForm from '../../components/forms/CandidateForm';
import ErrorState from '../../components/feedback/ErrorState';
import Skeleton from '../../components/feedback/Skeleton';
import TriangleMark from '../../components/ui/TriangleMark';
import { useRecruitmentProcessById } from '../../hooks/useRecruitmentProcess';
import { formatDate, toIsoDate } from '../../lib/format';

/**
 * Detalhe de um processo seletivo: edital, anexos e formulário de inscrição.
 *
 * ESTRUTURA, e por quê:
 *  1. Cabeçalho com título, data e um botão "Ir para a inscrição" que rola até
 *     o formulário. Editais são longos; sem esse atalho, quem já leu tudo e
 *     voltou depois precisa rolar a página inteira de novo.
 *  2. Descrição.
 *  3. Anexos — só se existirem.
 *  4. Formulário, numa faixa destacada, com `scroll-margin` para o título não
 *     ficar escondido atrás da navbar fixa quando a âncora salta até lá.
 */
export default function WorkWithUsDetail() {
    const { id } = useParams();
    const { data: process, isPending, isError, error, refetch } = useRecruitmentProcessById(id);

    if (isPending) {
        return (
            <Container className="py-12 sm:py-16">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-4 h-10 w-full max-w-2xl" />
                <Skeleton className="mt-3 h-10 w-full max-w-md" />
                <div className="mt-10 space-y-3">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <Skeleton key={index} className="h-4 w-full" />
                    ))}
                </div>
            </Container>
        );
    }

    if (isError) {
        return (
            <Container className="py-12 sm:py-16">
                <ErrorState
                    title="Não foi possível carregar este processo seletivo"
                    description="Ele pode ter sido removido, ou o link pode estar incorreto."
                    error={error}
                    onRetry={() => refetch()}
                />
                <div className="mt-6 text-center">
                    <Button to="/trabalhe-conosco" variant="secondary">
                        Ver todos os processos
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <>
            {/* Mesmo verde da listagem de processos seletivos: quem clicou num
                card verde precisa chegar numa página verde, senão a navegação
                parece ter levado para outro lugar. */}
            <div style={accentVars('leaf')} className="relative overflow-hidden bg-ink-900">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,var(--color-ink-950)_0%,var(--color-ink-900)_38%,var(--accent-deep)_100%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[var(--accent)] opacity-30 blur-[90px]"
                />
                <TriangleMark
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 opacity-[0.07]"
                    color="white"
                />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-[var(--accent)]" />
                <Container className="relative">
                    <div className="py-10 sm:py-14">
                        {/* Voltar explícito: no celular o botão do sistema existe,
                            mas quem chegou por link compartilhado não tem para
                            onde voltar. */}
                        <Link
                            to="/trabalhe-conosco"
                            className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                        >
                            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 10H5M9 5 4 10l5 5" />
                            </svg>
                            Todos os processos seletivos
                        </Link>

                        <div className="mt-5 flex flex-wrap items-center gap-2">
                            {process.active ? (
                                <Badge tone="success">Inscrições abertas</Badge>
                            ) : (
                                <Badge tone="inverse">Processo encerrado</Badge>
                            )}
                            <time
                                dateTime={toIsoDate(process.creationDate)}
                                className="text-xs font-bold uppercase tracking-wider text-leaf-bright"
                            >
                                Publicado em {formatDate(process.creationDate)}
                            </time>
                        </div>

                        <h1 className="mt-3 max-w-3xl text-[1.75rem] leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                            {process.title}
                        </h1>

                        {/* Âncora nativa (#inscricao), não um onClick com
                            scrollIntoView. O <a> funciona antes mesmo de o
                            JavaScript carregar, e a rolagem suave já está no
                            CSS — junto com o respeito a "reduzir movimento". */}
                        {process.active && (
                            <Button href="#inscricao" variant="inverse" size="lg" className="mt-7">
                                Ir para a inscrição
                            </Button>
                        )}
                    </div>
                </Container>
            </div>

            <Container size="narrow" className="py-10 sm:py-14">
                <RichText text={process.description} />

                <div className="mt-10">
                    <AttachmentList
                        files={process.filesPaths}
                        category="rps"
                        title="Edital e documentos"
                    />
                </div>
            </Container>

            {/* ------------------------------------------------- INSCRIÇÃO -- */}
            <section id="inscricao" className="scroll-mt-24 bg-leaf-tint py-12 sm:py-16">
                <Container size="narrow">
                    {process.active ? (
                        <>
                            <h2 className="text-2xl text-ink-900 sm:text-3xl">Inscreva-se</h2>
                            <p className="mt-2 text-[0.9375rem] text-muted">
                                Preencha seus dados e anexe o currículo. Leva menos de cinco minutos.
                            </p>

                            <div className="mt-8 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-8">
                                <CandidateForm
                                    recruitmentProcessId={process.id}
                                    processTitle={process.title}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl bg-white p-6 text-center shadow-card ring-1 ring-line sm:p-10">
                            <h2 className="text-xl text-ink-900">As inscrições para este processo foram encerradas</h2>
                            <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-muted">
                                Este edital fica publicado para consulta. Veja os processos com
                                inscrições abertas hoje.
                            </p>
                            <Button to="/trabalhe-conosco" className="mt-6">
                                Ver processos abertos
                            </Button>
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
