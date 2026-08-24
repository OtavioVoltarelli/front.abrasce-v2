/**
 * Junta classes CSS ignorando valores falsos.
 *
 * Serve para escrever `cn('p-4', isActive && 'bg-brand-600')` sem que um
 * `false` vire a string "false" no atributo class. É a única coisa que a
 * biblioteca `clsx` faz para o nosso caso de uso — não vale uma dependência.
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
