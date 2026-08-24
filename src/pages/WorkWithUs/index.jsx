import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import JobCard from '../../components/cards/JobCard';
import QueryBoundary from '../../components/feedback/QueryBoundary';
import Skeleton from '../../components/feedback/Skeleton';
import { useActiveRecruitmentProcesses } from '../../hooks/useRecruitmentProcess';

/**
 * Trabalhe conosco — listagem dos processos seletivos abertos.
 *
 * Mostra só os ATIVOS: quem entra aqui quer saber onde pode se inscrever hoje.
 * Uma lista misturando vagas abertas e encerradas obriga a pessoa a filtrar na
 * cabeça, e a frustração de clicar numa vaga encerrada é evitável.
 */
export default function WorkWithUs() {
    const query = useActiveRecruitmentProcesses();

    return (
        <>
            <PageHeader
                eyebrow="Trabalhe conosco"
                title="Processos seletivos abertos"
                description="Leia o edital, confira os requisitos e faça sua inscrição pelo próprio site. Cada processo tem seu formulário."
            />

            <Container className="py-12 sm:py-16">
                <QueryBoundary
                    query={query}
                    errorTitle="Não foi possível carregar os processos seletivos"
                    skeleton={
                        <div className="space-y-4">
                            {[0, 1, 2].map((index) => (
                                <div key={index} className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
                                    <Skeleton className="h-3 w-40" />
                                    <Skeleton className="mt-3 h-6 w-full max-w-lg" />
                                    <Skeleton className="mt-3 h-4 w-32" />
                                </div>
                            ))}
                        </div>
                    }
                    empty={{
                        icon: (
                            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="7" width="18" height="13" rx="2" />
                                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        ),
                        title: 'Nenhum processo seletivo aberto no momento',
                        description:
                            'Quando a ABRASCE abrir uma nova vaga, ela aparece aqui com o edital completo. Vale acompanhar as notícias para não perder.',
                        action: { label: 'Ver notícias', to: '/noticias' },
                    }}
                >
                    {(processes) => (
                        <>
                            <p className="mb-6 text-sm text-muted">
                                {processes.length === 1
                                    ? '1 processo seletivo com inscrições abertas'
                                    : `${processes.length} processos seletivos com inscrições abertas`}
                            </p>

                            {/* <ul> em vez de uma sequência de <div>: um leitor de
                                tela anuncia "lista com 4 itens" e a pessoa sabe o
                                tamanho da lista antes de percorrer. */}
                            <ul className="space-y-4">
                                {processes.map((process) => (
                                    <li key={process.id}>
                                        <JobCard process={process} />
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </QueryBoundary>
            </Container>
        </>
    );
}
