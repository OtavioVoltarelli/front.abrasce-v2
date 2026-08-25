import { Link, useParams } from 'react-router-dom';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import RichText from '../../components/RichText';
import AttachmentList from '../../components/AttachmentList';
import ErrorState from '../../components/feedback/ErrorState';
import Skeleton from '../../components/feedback/Skeleton';
import { useNewsById } from '../../hooks/useNews';
import { formatDate, toIsoDate } from '../../lib/format';
import { fileUrl } from '../../services/config';

/**
 * Notícia completa.
 *
 * A prioridade aqui é UMA: ler o texto sem cansar. Por isso:
 *
 *  · Container `narrow` (48rem) e `.prose-abrasce` com `max-width: 68ch`.
 *    Linha longa demais faz o olho perder o começo da linha seguinte — o
 *    limite confortável fica entre 45 e 75 caracteres.
 *  · Corpo em 17px com entrelinha 1.8, acima do padrão do site. Texto longo
 *    pede mais ar entre as linhas do que uma legenda de card.
 *  · A DESCRIÇÃO CURTA não aparece aqui (regra do briefing): ela é a chamada
 *    da listagem. Repeti-la logo antes do texto completo faz a pessoa ler a
 *    mesma frase duas vezes.
 *
 * A capa usa `fetchPriority="high"`: ela é a maior imagem visível ao abrir a
 * página, então avisar o navegador para buscá-la antes das outras melhora a
 * sensação de velocidade.
 */
export default function NewsDetail() {
    const { id } = useParams();
    const { data: news, isPending, isError, error, refetch } = useNewsById(id);

    if (isPending) {
        return (
            <Container size="narrow" className="py-12 sm:py-16">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="mt-4 h-9 w-full" />
                <Skeleton className="mt-2 h-9 w-2/3" />
                <Skeleton className="mt-8 aspect-[16/9] w-full rounded-2xl" />
                <div className="mt-8 space-y-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
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
                    title="Não foi possível carregar esta notícia"
                    description="Ela pode ter sido removida, ou o link pode estar incorreto."
                    error={error}
                    onRetry={() => refetch()}
                />
                <div className="mt-6 text-center">
                    <Button to="/noticias" variant="secondary">
                        Ver todas as notícias
                    </Button>
                </div>
            </Container>
        );
    }

    return (
        <article className="py-8 sm:py-12">
            <Container size="narrow">
                <Link
                    to="/noticias"
                    className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-coral-ink transition-colors hover:brightness-90"
                >
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 10H5M9 5 4 10l5 5" />
                    </svg>
                    Todas as notícias
                </Link>

                <header className="mt-5">
                    <time
                        dateTime={toIsoDate(news.creationDate)}
                        className="text-xs font-bold uppercase tracking-wider text-coral-ink"
                    >
                        {formatDate(news.creationDate)}
                    </time>
                    <h1 className="mt-2 text-[1.875rem] leading-[1.1] text-ink-900 sm:text-4xl lg:text-[2.75rem]">
                        {news.title}
                    </h1>
                </header>
            </Container>

            {news.coverImage && (
                <Container size="narrow" className="mt-8">
                    <img
                        src={fileUrl('admin', news.coverImage.storedName)}
                        alt=""
                        fetchPriority="high"
                        decoding="async"
                        className="aspect-[16/9] w-full rounded-2xl bg-sand object-cover shadow-card"
                    />
                </Container>
            )}

            <Container size="narrow" className="mt-8 sm:mt-10">
                <RichText text={news.longDescription} />

                <div className="mt-10">
                    <AttachmentList files={news.filesPath} category="news" title="Anexos" />
                </div>

                <div className="mt-10 border-t border-line pt-8">
                    <Button to="/noticias" variant="secondary">
                        Ver outras notícias
                    </Button>
                </div>
            </Container>
        </article>
    );
}
