import { Link } from 'react-router-dom';
import { areaVars } from '../../content/areas';

/**
 * Card de uma área de atuação.
 *
 * A cor da área entra como variável CSS pelo `style`, e as classes usam
 * `bg-[var(--area)]`. Assim existe UMA regra no CSS final que serve às seis
 * áreas — e a sétima, se um dia existir, funciona sem tocar em nada.
 *
 * O card inteiro é um link. Detalhe importante: o <img> tem `alt=""` porque o
 * texto do link já descreve o destino. Se a imagem também tivesse descrição,
 * o leitor de tela leria a mesma coisa duas vezes.
 */
export default function AreaCard({ area, to }) {
    return (
        <Link
            to={to}
            style={areaVars(area)}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line transition-all duration-200 hover:-translate-y-1 hover:shadow-lift motion-reduce:hover:translate-y-0"
        >
            {/* A faixa de cor no topo é o que identifica a área de relance,
                antes mesmo de ler o título. */}
            <span aria-hidden="true" className="h-1.5 w-full bg-[var(--area)]" />

            <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                <img
                    src={area.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg text-ink-900 sm:text-xl">{area.label}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{area.summary}</p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--area-ink)]">
                    Ver projetos
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 10h11M11 5l5 5-5 5" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
