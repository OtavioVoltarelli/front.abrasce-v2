import Button from '../ui/Button';

/**
 * Tela de "não há nada aqui".
 *
 * Uma lista vazia sem explicação parece um site quebrado. O estado vazio tem
 * três trabalhos: dizer que está vazio DE PROPÓSITO, explicar por quê, e
 * oferecer o próximo passo. Nunca é só a frase "nenhum resultado".
 */
export default function EmptyState({ icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-sand/60 px-6 py-12 text-center">
            {icon && (
                <span aria-hidden="true" className="mb-4 grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-card">
                    {icon}
                </span>
            )}
            <h3 className="text-lg text-ink-900">{title}</h3>
            {description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}
            {action && (
                <Button {...action} className="mt-6" variant={action.variant ?? 'secondary'}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}
