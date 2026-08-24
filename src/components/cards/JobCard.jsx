import { Link } from 'react-router-dom';
import { formatDate, toIsoDate } from '../../lib/format';
import Badge from '../ui/Badge';

/**
 * Card de processo seletivo, para a listagem de Trabalhe conosco.
 *
 * Por que card e não tabela: uma tabela com 4 colunas em tela de 360px ou
 * ganha barra de rolagem horizontal, ou aperta o texto a ponto de "Professor
 * de música — Escola de Artes" virar quatro linhas de uma palavra. Card
 * empilha naturalmente e cresce conforme o conteúdo.
 *
 * A quantidade de anexos aparece como informação, não como ícone solto: quem
 * está se candidatando quer saber se existe edital para ler ANTES de abrir.
 */
export default function JobCard({ process }) {
    const attachments = process.filesPaths?.length ?? 0;

    return (
        <article className="group relative flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line transition-shadow hover:shadow-lift sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            {/* Barra de cor na lateral: âncora visual da lista, e o único
                lugar do card onde a marca aparece. */}
            <span aria-hidden="true" className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-brand-600 sm:inset-y-6" />

            <div className="min-w-0 flex-1 pl-3">
                <div className="flex flex-wrap items-center gap-2">
                    <time
                        dateTime={toIsoDate(process.creationDate)}
                        className="text-xs font-bold uppercase tracking-wider text-muted"
                    >
                        Publicado em {formatDate(process.creationDate)}
                    </time>
                    {process.active ? (
                        <Badge tone="success">Inscrições abertas</Badge>
                    ) : (
                        <Badge tone="neutral">Encerrado</Badge>
                    )}
                </div>

                <h3 className="mt-2 text-lg text-ink-900 sm:text-xl">
                    <Link
                        to={`/trabalhe-conosco/${process.id}`}
                        className="after:absolute after:inset-0 hover:text-brand-700"
                    >
                        {process.title}
                    </Link>
                </h3>

                {attachments > 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2v6h6M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        </svg>
                        {attachments === 1 ? '1 documento anexo' : `${attachments} documentos anexos`}
                    </p>
                )}
            </div>

            <span className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white sm:self-auto">
                Ver detalhes
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10h11M11 5l5 5-5 5" />
                </svg>
            </span>
        </article>
    );
}
