import Container from '../ui/Container';
import TriangleMark from '../ui/TriangleMark';
import AreaRange from '../AreaRange';
import { accentVars } from '../../lib/palette';

/**
 * Cabeçalho das páginas internas (Notícias, Trabalhe conosco, Projetos…).
 *
 * ---------------------------------------------------------------------------
 * POR QUE ELE TEM UMA COR POR PÁGINA
 * ---------------------------------------------------------------------------
 * Antes este cabeçalho era um azul-marinho chapado, igual em todas as páginas.
 * Como ele é a PRIMEIRA COISA que aparece ao abrir qualquer página interna, o
 * site inteiro dava a impressão de ser uma tela só repetida — mesmo com o
 * conteúdo abaixo sendo completamente diferente.
 *
 * Agora cada página escolhe um acento (`accent="leaf"`, `accent="coral"`…) e
 * ele entra em quatro lugares ao mesmo tempo:
 *   1. o degradê do fundo, que vai do azul-marinho até a cor da página;
 *   2. o brilho desfocado atrás do texto;
 *   3. o sobretítulo, na versão CLARA da cor (`--accent-bright`);
 *   4. o filete de 4px na base.
 *
 * O que NÃO muda: a base azul-marinho, o triângulo do logo como textura, o
 * tamanho e o ritmo do texto. É isso que mantém a sensação de ser um site só.
 * Cor diferente com estrutura igual = variedade; estrutura diferente também =
 * páginas que parecem de sites diferentes.
 *
 * `rule="areas"` troca o filete pela serra de seis cores — usado na página de
 * Projetos, que é a única que não pertence a uma área só.
 */
export default function PageHeader({
    eyebrow,
    title,
    description,
    accent = 'brand',
    rule = 'accent',
    children,
}) {
    return (
        <div style={accentVars(accent)} className="relative overflow-hidden bg-ink-900">
            {/* O degradê é uma camada própria, e não `background` no elemento,
                porque assim o `bg-ink-900` acima continua valendo como cor de
                segurança: se o degradê não pintar por qualquer motivo, o texto
                branco ainda cai sobre fundo escuro em vez de sumir. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,var(--color-ink-950)_0%,var(--color-ink-900)_38%,var(--accent-deep)_100%)]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[var(--accent)] opacity-30 blur-[90px] sm:h-96 sm:w-96"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand-600 opacity-25 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 opacity-[0.07] sm:-right-8"
            >
                <TriangleMark className="h-64 w-64 sm:h-80 sm:w-80" color="white" />
            </div>

            <Container className="relative">
                <div className="py-12 sm:py-16 lg:py-20">
                    {eyebrow && (
                        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-bright)]">
                            <TriangleMark className="h-2.5 w-2.5" />
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="max-w-3xl text-[2rem] leading-[1.08] text-white sm:text-5xl lg:text-[3.25rem]">
                        {title}
                    </h1>
                    {/* Branco a 75% em vez de um azul-claro fixo: o texto de apoio
                        precisa funcionar sobre SEIS fundos diferentes agora, e um
                        neutro é o único tom que não briga com nenhum deles. */}
                    {description && (
                        <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-lg">{description}</p>
                    )}
                    {children && <div className="mt-8">{children}</div>}
                </div>
            </Container>

            {rule === 'areas' ? (
                <AreaRange className="h-3 sm:h-4" />
            ) : (
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-[var(--accent)]" />
            )}
        </div>
    );
}
