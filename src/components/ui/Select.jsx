import Field from './Field';
import { controlClasses } from './controlClasses';
import { cn } from '../../lib/cn';

/**
 * Lista suspensa.
 *
 * Usa o <select> nativo de propósito, em vez de um menu feito com <div>.
 * No celular, o <select> nativo abre a roleta do próprio sistema — que é
 * grande, rolável com o dedo, funciona com o leitor de tela e a pessoa já
 * sabe usar. Nenhum menu customizado chega perto disso, e todos custam
 * JavaScript a mais para baixar.
 *
 * A seta é desenhada em CSS (background-image) porque `appearance-none`
 * remove a seta nativa junto com o estilo do sistema.
 */
export default function Select({ label, hint, error, required, options = [], placeholder, className, ...props }) {
    return (
        <Field label={label} hint={hint} error={error} required={required} className={className}>
            {({ id, describedBy, invalid }) => (
                <div className="relative">
                    <select
                        id={id}
                        aria-describedby={describedBy}
                        aria-invalid={invalid || undefined}
                        className={cn(controlClasses(invalid), 'appearance-none pr-11 cursor-pointer')}
                        {...props}
                    >
                        {placeholder && <option value="">{placeholder}</option>}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    >
                        <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}
        </Field>
    );
}
