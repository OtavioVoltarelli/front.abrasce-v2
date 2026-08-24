import Container from '../ui/Container';
import TriangleMark from '../ui/TriangleMark';

/**
 * Cabeçalho das páginas internas (Notícias, Trabalhe conosco, Projetos…).
 *
 * Fundo escuro, mesmo desenho em todas: é o que dá ao site a sensação de ser
 * um lugar só. Páginas com cabeçalhos diferentes parecem sites diferentes.
 *
 * O triângulo do logo aparece grande e cortado no canto — a assinatura visual
 * da ABRASCE usada como textura, não como logotipo.
 */
export default function PageHeader({ eyebrow, title, description, children }) {
    return (
        <div className="relative overflow-hidden bg-ink-900">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 opacity-[0.07] sm:-right-8"
            >
                <TriangleMark className="h-64 w-64 sm:h-80 sm:w-80" color="white" />
            </div>
            {/* Brilho suave atrás do texto, para o título nunca cair num azul chapado */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-600/25 blur-3xl"
            />

            <Container className="relative">
                <div className="py-12 sm:py-16 lg:py-20">
                    {eyebrow && (
                        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-aqua">
                            <TriangleMark className="h-2.5 w-2.5" />
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="max-w-3xl text-[2rem] leading-[1.08] text-white sm:text-5xl lg:text-[3.25rem]">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-5 max-w-2xl text-base text-brand-200 sm:text-lg">{description}</p>
                    )}
                    {children && <div className="mt-8">{children}</div>}
                </div>
            </Container>
        </div>
    );
}
