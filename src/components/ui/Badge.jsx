import { cn } from '../../lib/cn';

/**
 * Etiqueta curta: área de atuação, status de um processo seletivo, contagem.
 *
 * Quando recebe uma `area` (ver content/areas.js), pinta-se com a cor daquela
 * área — injetada como variável CSS. Nunca monte a classe concatenando string
 * (`bg-${cor}-100`): o Tailwind lê o código-fonte procurando classes escritas
 * por extenso e uma classe montada em tempo de execução nunca é encontrada,
 * então ela simplesmente não existe no CSS final.
 */
export default function Badge({ area, tone = 'neutral', children, className }) {
    const base =
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide';

    if (area) {
        return (
            <span
                style={{ '--area': area.color, '--area-ink': area.ink, '--area-tint': area.tint }}
                className={cn(base, 'bg-[var(--area-tint)] text-[var(--area-ink)]', className)}
            >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--area)]" />
                {children ?? area.label}
            </span>
        );
    }

    const tones = {
        neutral: 'bg-sand text-muted',
        brand: 'bg-brand-50 text-brand-700',
        success: 'bg-green-50 text-green-800',
        warning: 'bg-amber-50 text-amber-800',
        inverse: 'bg-white/15 text-white',
    };

    return <span className={cn(base, tones[tone], className)}>{children}</span>;
}
