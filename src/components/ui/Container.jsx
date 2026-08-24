import { cn } from '../../lib/cn';

/**
 * Caixa que centraliza e limita a largura do conteúdo.
 *
 * As margens laterais (`px-5`) são o que impede o texto de encostar na borda
 * da tela do celular — sem elas a leitura fica desconfortável e o polegar
 * cobre a primeira letra de cada linha.
 *
 * `max-w-6xl` (72rem) no desktop: uma linha de texto muito larga faz o olho
 * perder o começo da linha seguinte.
 */
export default function Container({ as: Tag = 'div', size = 'default', className, children }) {
    const widths = {
        narrow: 'max-w-3xl',   /* texto corrido, leitura longa */
        default: 'max-w-6xl',  /* padrão das seções */
        wide: 'max-w-7xl',     /* grades largas */
    };

    return (
        <Tag className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', widths[size], className)}>
            {children}
        </Tag>
    );
}
