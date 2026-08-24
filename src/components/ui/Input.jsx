import Field from './Field';
import { controlClasses } from './controlClasses';

/**
 * Campo de texto.
 *
 * `inputMode` e `autoComplete` são o que faz a diferença no celular:
 * `inputMode="tel"` abre o teclado numérico em vez do alfabético, e
 * `autoComplete="email"` deixa o navegador preencher sozinho. Digitar um
 * e-mail inteiro numa tela de vidro é chato — cada um desses atributos
 * economiza segundos reais de quem está preenchendo.
 */
export default function Input({ label, hint, error, required, className, ...props }) {
    return (
        <Field label={label} hint={hint} error={error} required={required} className={className}>
            {({ id, describedBy, invalid }) => (
                <input
                    id={id}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    className={controlClasses(invalid)}
                    {...props}
                />
            )}
        </Field>
    );
}
