import { cn } from '../../lib/cn';
import { accentVars } from '../../lib/palette';
import TriangleMark from './TriangleMark';

/**
 * Cabeçalho padrão de seção: sobretítulo curto, título e texto de apoio.
 *
 * O "sobretítulo" (eyebrow) é a linha pequena em maiúsculas acima do título.
 * Ele diz QUE TIPO de conteúdo vem a seguir, deixando o título livre para
 * dizer a coisa em si. Sem ele, títulos precisam fazer os dois trabalhos e
 * ficam compridos.
 *
 * `accent` pinta o sobretítulo com a cor da seção. Sempre na versão `-ink`,
 * que é a única da paleta aprovada para texto sobre fundo claro — a versão
 * cheia de vários acentos não passa no contraste mínimo como texto.
 *
 * `level` controla a tag do heading sem mudar a aparência. Isso importa: a
 * ordem h1 -> h2 -> h3 é como um leitor de tela navega a página, e pular
 * níveis só para conseguir o tamanho de fonte certo quebra essa navegação.
 */
export default function SectionHeading({
    eyebrow,
    title,
    description,
    accent = 'brand',
    level = 2,
    className,
}) {
    const Heading = `h${level}`;

    return (
        <div style={accentVars(accent)} className={cn('max-w-2xl', className)}>
            {eyebrow && (
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-ink)]">
                    <TriangleMark className="h-2.5 w-2.5 shrink-0" />
                    {eyebrow}
                </p>
            )}

            <Heading className="text-[1.75rem] leading-[1.12] text-ink-900 sm:text-4xl lg:text-[2.75rem]">
                {title}
            </Heading>

            {description && <p className="mt-4 text-base text-muted sm:text-lg">{description}</p>}
        </div>
    );
}
