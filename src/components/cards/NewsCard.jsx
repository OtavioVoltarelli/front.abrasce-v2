import { Link } from 'react-router-dom';
import { formatDate, toIsoDate } from '../../lib/format';
import { fileUrl } from '../../services/config';

/**
 * Card de notícia. Usado na Home e na listagem de Notícias.
 *
 * Decisões que valem para qualquer card de lista:
 *
 * · `aspect-[16/9]` na imagem: reserva o espaço certo ANTES de a imagem
 *   baixar. Sem isso o card cresce quando a foto chega e a lista inteira
 *   pula para baixo.
 * · `clamp-2` no título e `clamp-3` no resumo: com títulos de tamanhos
 *   diferentes, cards da mesma linha ficariam com alturas diferentes e o
 *   grid perderia o alinhamento.
 * · Data em <time datetime="..."> — o formato legível para gente fica no
 *   texto, o formato legível para máquina no atributo.
 * · Só o TÍTULO é o link, e ele é esticado por cima do card inteiro com
 *   `after:absolute after:inset-0`. Assim o card todo é clicável, mas o
 *   leitor de tela anuncia um link só, com o título como nome — em vez de
 *   três links seguidos para o mesmo lugar.
 */
export default function NewsCard({ news, featured = false }) {
    return (
        <article
            /* `h-full`: dentro de uma grade, o <li> já estica para a altura
               da linha, mas o card precisa ser mandado a preencher esse <li>.
               Sem isso, cards com títulos de tamanhos diferentes ficam com
               alturas diferentes e a linha desalinha. */
            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line transition-shadow hover:shadow-lift ${
                featured ? 'sm:flex-row' : ''
            }`}
        >
            <div
                className={`relative shrink-0 overflow-hidden bg-sand ${
                    featured ? 'aspect-[16/9] sm:aspect-auto sm:w-[45%]' : 'aspect-[16/9]'
                }`}
            >
                <img
                    src={fileUrl('admin', news.coverImagePath)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <time
                    dateTime={toIsoDate(news.creationDate)}
                    className="text-xs font-bold uppercase tracking-wider text-brand-600"
                >
                    {formatDate(news.creationDate)}
                </time>

                <h3
                    className={`mt-2 text-ink-900 ${featured ? 'text-xl sm:text-2xl' : 'text-lg clamp-2'}`}
                >
                    <Link
                        to={`/noticias/${news.id}`}
                        className="after:absolute after:inset-0 hover:text-brand-700"
                    >
                        {news.title}
                    </Link>
                </h3>

                <p className="clamp-3 mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                    {news.shortDescription}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                    Ler notícia
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 10h11M11 5l5 5-5 5" />
                    </svg>
                </span>
            </div>
        </article>
    );
}
