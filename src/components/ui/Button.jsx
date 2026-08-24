import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

/**
 * Botão único do site — em três formas: <button>, <Link> do React Router e
 * <a> para links externos.
 *
 * Por que um componente só em vez de estilizar cada botão na hora?
 * Porque "todo botão primário tem 44px de altura mínima" é uma regra que só
 * se sustenta se existir UM lugar que a aplique. Espalhada, ela vira "quase
 * todo botão" em três semanas.
 *
 * O `min-h-11` (44px) não é estética: é o menor alvo que um dedo acerta com
 * confiança. Abaixo disso a pessoa erra, e errar num celular custa um scroll
 * de volta e uma nova tentativa.
 */

const VARIANTS = {
    /* Ação principal da tela. Só um por tela, senão nenhum é o principal. */
    primary:
        'bg-brand-600 text-white shadow-card hover:bg-brand-700 active:bg-brand-800',
    /* Ação secundária: mesmo peso visual de estrutura, menos peso de cor. */
    secondary:
        'bg-white text-brand-700 ring-1 ring-inset ring-line hover:bg-brand-50 hover:ring-brand-200',
    /* Para uso sobre fundo escuro. */
    inverse:
        'bg-white text-ink-900 hover:bg-brand-50',
    outlineInverse:
        'text-white ring-1 ring-inset ring-white/40 hover:bg-white/10 hover:ring-white/70',
    /* Ação terciária, sem caixa. */
    ghost:
        'text-brand-700 hover:bg-brand-50',
    /* Ação destrutiva. Vermelho é o único uso de vermelho no site — reservá-lo
       para "isto apaga algo" é o que faz a cor significar alguma coisa. */
    danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
};

const SIZES = {
    sm: 'min-h-10 px-4 text-sm gap-1.5',
    md: 'min-h-11 px-5 text-[0.9375rem] gap-2',
    lg: 'min-h-13 px-7 text-base gap-2.5',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    to,
    href,
    type = 'button',
    className,
    children,
    fullWidth = false,
    ...props
}) {
    const classes = cn(
        'inline-flex items-center justify-center rounded-xl font-semibold',
        'transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-55',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
    );

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        /* Só link para OUTRO SITE abre em nova aba.
           · "#inscricao" precisa rolar a página, não abrir aba.
           · "mailto:" e "tel:" entregam o endereço ao aplicativo de e-mail ou
             ao discador. Com target="_blank" o navegador ainda abre uma aba em
             branco que fica lá, órfã, depois que o aplicativo assume.
           Todo link realmente externo leva rel="noreferrer": sem ele a página
           de destino recebe acesso a `window.opener` e pode trocar o conteúdo
           da sua aba pelas costas. */
        const opensInApp = /^(#|mailto:|tel:)/.test(href);

        return (
            <a
                href={href}
                target={opensInApp ? undefined : '_blank'}
                rel={opensInApp ? undefined : 'noreferrer'}
                className={classes}
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <button type={type} className={classes} {...props}>
            {children}
        </button>
    );
}
