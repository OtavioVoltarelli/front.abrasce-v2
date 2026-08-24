import { areaVars, findArea } from '../../content/areas';
import Badge from '../ui/Badge';

/**
 * Card de um projeto real da ABRASCE (Paiê, Escola de Artes, Residência
 * Inclusiva…), com o município e as áreas que ele atende.
 *
 * No site antigo, cada projeto aparecia repetido dentro de um componente por
 * área — o "Paiê" estava escrito em quatro arquivos diferentes. Aqui ele é uma
 * entrada só em `content/projects.js` que declara suas quatro áreas, e este
 * card as apresenta como etiquetas.
 *
 * As logos são fotos/marcas com fundos claros e formatos diferentes; `contain`
 * (e não `cover`) garante que nenhuma seja cortada ao meio.
 */
export default function ProjectCard({ project }) {
    const primaryArea = findArea(project.areas[0]);

    return (
        <article
            style={primaryArea ? areaVars(primaryArea) : undefined}
            className="flex gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-5"
        >
            <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-sand ring-1 ring-line sm:size-20">
                <img
                    src={project.logo}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-contain"
                />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="text-base text-ink-900 sm:text-lg">{project.name}</h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11" />
                        <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {project.city} — {project.state}
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.areas.map((slug) => {
                        const area = findArea(slug);
                        if (!area) return null;
                        return (
                            <li key={slug}>
                                <Badge area={area} />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </article>
    );
}
