import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import NewsCard from '../../components/cards/NewsCard';
import QueryBoundary from '../../components/feedback/QueryBoundary';
import Skeleton from '../../components/feedback/Skeleton';
import { useAllNews } from '../../hooks/useNews';

/**
 * Listagem de notícias.
 *
 * A mais recente ganha um card LARGO (imagem à esquerda, texto à direita a
 * partir do tablet) e as demais entram numa grade de três colunas. Essa
 * hierarquia responde à pergunta "o que aconteceu de mais novo?" antes de
 * qualquer leitura — que é a razão de alguém abrir esta página.
 *
 * No celular a distinção some: em uma coluna só, os dois formatos ficariam
 * idênticos, e forçar um card gigante no topo custaria uma tela inteira de
 * rolagem para mostrar uma notícia só.
 */
export default function News() {
    const query = useAllNews();

    return (
        <>
            <PageHeader
                eyebrow="Notícias"
                title="Acontece na ABRASCE"
                description="Ações, resultados e avisos dos projetos nos municípios onde a associação atua."
            />

            <Container className="py-12 sm:py-16">
                <QueryBoundary
                    query={query}
                    errorTitle="Não foi possível carregar as notícias"
                    skeleton={
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line sm:flex">
                                <Skeleton className="aspect-[16/9] rounded-none sm:w-[45%]" />
                                <div className="flex-1 space-y-3 p-6">
                                    <Skeleton className="h-3 w-32" />
                                    <Skeleton className="h-7 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line">
                                        <Skeleton className="aspect-[16/9] rounded-none" />
                                        <div className="space-y-3 p-5">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-5 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    empty={{
                        icon: (
                            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                                <path d="M8 9h7M8 13h7M8 17h4" />
                            </svg>
                        ),
                        title: 'Ainda não há notícias publicadas',
                        description:
                            'Assim que a ABRASCE publicar a primeira notícia, ela aparece aqui.',
                        action: { label: 'Conhecer os projetos', to: '/projetos' },
                    }}
                >
                    {(news) => {
                        const [featured, ...rest] = news;

                        return (
                            <div className="space-y-6 lg:space-y-8">
                                <NewsCard news={featured} featured />

                                {rest.length > 0 && (
                                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                                        {rest.map((item) => (
                                            <li key={item.id}>
                                                <NewsCard news={item} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    }}
                </QueryBoundary>
            </Container>
        </>
    );
}
