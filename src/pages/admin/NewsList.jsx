import { Link } from 'react-router-dom';
import AdminPage from '../../components/admin/AdminPage';
import FlashMessage from '../../components/admin/FlashMessage';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import QueryBoundary from '../../components/feedback/QueryBoundary';
import Skeleton from '../../components/feedback/Skeleton';
import { useAllNews } from '../../hooks/useNews';
import { formatShortDate, toIsoDate } from '../../lib/format';
import { fileUrl } from '../../services/config';

/**
 * Listagem administrativa de notícias.
 *
 * A miniatura da capa aparece em cada linha. Numa lista de notícias, a foto é
 * o jeito mais rápido de reconhecer qual é qual — mais rápido do que ler o
 * título. Ela é pequena (64px) de propósito: a lista tem que caber na tela.
 */
export default function AdminNewsList() {
    const query = useAllNews();

    return (
        <AdminPage
            title="Notícias"
            description="Toque em uma notícia para editar ou excluir."
            action={
                <Button to="/admin/noticias/nova" size="lg">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Criar notícia
                </Button>
            }
        >
            <FlashMessage />

            <QueryBoundary
                query={query}
                errorTitle="Não foi possível carregar as notícias"
                skeleton={
                    <ul className="space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <li key={index} className="flex gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
                                <Skeleton className="size-16 shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </li>
                        ))}
                    </ul>
                }
                empty={{
                    icon: (
                        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                            <path d="M8 9h7M8 13h7M8 17h4" />
                        </svg>
                    ),
                    title: 'Nenhuma notícia publicada',
                    description: 'Crie a primeira notícia para que ela apareça na home e na página de notícias do site.',
                    action: { label: 'Criar notícia', to: '/admin/noticias/nova', variant: 'primary' },
                }}
            >
                {(news) => (
                    <>
                        <p className="mb-4 text-sm text-muted">
                            {news.length === 1 ? '1 notícia publicada' : `${news.length} notícias publicadas`}
                        </p>

                        <ul className="space-y-3">
                            {news.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        to={`/admin/noticias/${item.id}`}
                                        className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-shadow hover:shadow-lift sm:p-5"
                                    >
                                        <img
                                            src={fileUrl('admin', item.coverImage?.storedName)}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="size-16 shrink-0 rounded-xl bg-sand object-cover sm:size-20"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <time
                                                    dateTime={toIsoDate(item.creationDate)}
                                                    className="text-xs text-muted"
                                                >
                                                    {formatShortDate(item.creationDate)}
                                                </time>
                                                {item.filesPath?.length > 0 && (
                                                    <Badge tone="brand">
                                                        {item.filesPath.length} anexo
                                                        {item.filesPath.length > 1 ? 's' : ''}
                                                    </Badge>
                                                )}
                                            </div>

                                            <h2 className="clamp-2 mt-1 font-display text-base font-bold leading-snug text-ink-900 sm:text-lg">
                                                {item.title}
                                            </h2>
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
                    </>
                )}
            </QueryBoundary>
        </AdminPage>
    );
}
