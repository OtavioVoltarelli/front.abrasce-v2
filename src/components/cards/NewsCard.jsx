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
 * · A data e o "Ler notícia" são CORAL, não azuis. A cor aqui não é enfeite:
 *   ela diz "isto é uma notícia". O card aparece na Home (página azul) e na
 *   listagem de Notícias (página coral) — em ambas, o coral identifica o tipo
 *   de conteúdo antes de qualquer leitura. É o mesmo princípio das seis cores
 *   de área: cor que carrega informação, não cor que decora.
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
               alturas diferentes e a linha desalinha.
               Hover igual ao do AreaCard (sobe + brilho colorido), em coral
               porque coral é a cor de "notícia". O foco cai no <Link> do
               título, não no <article>, por isso `has-focus-visible:` — "se
               algo DENTRO de mim está com foco de teclado, acenda". */
            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line [--glow:var(--color-coral)] transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-glow hover:ring-coral/40 has-focus-visible:shadow-glow motion-reduce:hover:translate-y-0 ${
                featured ? 'sm:flex-row' : ''
            }`}
        >
            <div
                className={`relative shrink-0 overflow-hidden bg-sand ${
                    featured ? 'aspect-[16/9] sm:aspect-auto sm:w-[45%]' : 'aspect-[16/9]'
                }`}
            >
                <img
                    src={fileUrl('admin', news.coverImage?.storedName)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <time
                    dateTime={toIsoDate(news.creationDate)}
                    className="text-xs font-bold uppercase tracking-wider text-coral-ink"
                >
                    {formatDate(news.creationDate)}
                </time>

                <h3
                    className={`mt-2 text-ink-900 ${featured ? 'text-xl sm:text-2xl' : 'text-lg clamp-2'}`}
                >
                    <Link
                        to={`/noticias/${news.id}`}
                        className="after:absolute after:inset-0 hover:text-coral-ink"
                    >
                        {news.title}
                    </Link>
                </h3>

                <p className="clamp-3 mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                    {news.shortDescription}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-coral-ink">
                    Ler notícia
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 10h11M11 5l5 5-5 5" />
                    </svg>
                </span>
            </div>
        </article>
    );
}
