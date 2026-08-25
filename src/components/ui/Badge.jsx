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

    /* Os tons vêm da PALETA DO SITE, não das cores padrão do Tailwind. Antes
       `success` era `green-50/green-800` e `warning` era `amber-50/amber-800`
       — verdes e âmbares que não existiam em nenhum outro lugar do projeto.
       Agora "inscrições abertas" usa exatamente o mesmo verde da assistência
       social e da página Trabalhe conosco. Uma etiqueta verde perdida no meio
       de um site sem verde nenhum parece um acidente; a mesma etiqueta num
       site que já tem aquele verde parece um sistema. */
    const tones = {
        neutral: 'bg-sand text-muted',
        brand: 'bg-brand-50 text-brand-700',
        success: 'bg-leaf-tint text-leaf-ink',
        warning: 'bg-sun-tint text-sun-ink',
        danger: 'bg-berry-tint text-berry-ink',
        news: 'bg-coral-tint text-coral-ink',
        info: 'bg-lagoon-tint text-lagoon-ink',
        inverse: 'bg-white/15 text-white',
    };

    return <span className={cn(base, tones[tone], className)}>{children}</span>;
}
