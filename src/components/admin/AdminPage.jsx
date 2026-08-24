import { cn } from '../../lib/cn';

/**
 * Moldura interna de uma tela do painel: título, descrição e a ação principal.
 *
 * No celular a ação principal ("Criar notícia") fica ABAIXO do título e ocupa
 * a largura toda; no desktop ela sobe para a direita do título. Botão de
 * largura total no celular não é preguiça de layout: é o alvo de toque mais
 * fácil que existe, e a ação principal merece o alvo mais fácil.
 */
export default function AdminPage({ title, description, action, children, className }) {
    return (
        <div className={cn('mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8', className)}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl text-ink-900 sm:text-3xl">{title}</h1>
                    {description && (
                        <p className="mt-1.5 text-sm text-muted sm:text-[0.9375rem]">{description}</p>
                    )}
                </div>
                {action && <div className="shrink-0 [&>*]:w-full sm:[&>*]:w-auto">{action}</div>}
            </div>

            <div className="mt-6 sm:mt-8">{children}</div>
        </div>
    );
}
