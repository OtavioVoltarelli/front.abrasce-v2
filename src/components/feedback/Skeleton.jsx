import { cn } from '../../lib/cn';

/**
 * Retângulo cinza pulsante que ocupa o lugar do conteúdo enquanto ele carrega.
 *
 * Por que isso em vez de um spinner no meio da tela?
 * Porque o esqueleto tem o TAMANHO do conteúdo que vai chegar. O spinner não —
 * quando os dados chegam, a página cresce de repente e tudo pula para baixo.
 * Esse pulo é o "layout shift": você vai tocar num link e ele se move no
 * milissegundo do toque, e você abre outra coisa. É um dos defeitos mais
 * irritantes em celular, e um dos mais fáceis de evitar.
 */
export default function Skeleton({ className }) {
    return (
        <span
            aria-hidden="true"
            className={cn('block animate-pulse rounded-lg bg-line/70 motion-reduce:animate-none', className)}
        />
    );
}
