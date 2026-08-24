import Field from './Field';
import { controlClasses } from './controlClasses';
import { cn } from '../../lib/cn';

export default function Textarea({ label, hint, error, required, rows = 6, className, ...props }) {
    return (
        <Field label={label} hint={hint} error={error} required={required} className={className}>
            {({ id, describedBy, invalid }) => (
                <textarea
                    id={id}
                    rows={rows}
                    aria-describedby={describedBy}
                    aria-invalid={invalid || undefined}
                    /* `resize-y`: a pessoa pode aumentar a altura para reler o
                       que escreveu, mas não a largura — arrastar para os lados
                       criaria scroll horizontal na página. */
                    className={cn(controlClasses(invalid), 'resize-y leading-relaxed')}
                    {...props}
                />
            )}
        </Field>
    );
}
