import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import TriangleMark from '../../components/ui/TriangleMark';
import { PUBLIC_NAV } from '../../lib/navigation';

/**
 * Página 404.
 *
 * O site antigo não tinha nenhuma: qualquer endereço errado mostrava uma tela
 * em branco, sem menu e sem saída. Com o `<Route path="*">` isso não acontece
 * mais — e a página oferece caminhos, em vez de só informar o erro.
 */
export default function NotFound() {
    return (
        <Container className="flex flex-col items-center py-20 text-center sm:py-28">
            {/* Âmbar, não vermelho: um endereço errado é um desencontro, não
                um erro grave. Vermelho no site está reservado para "isto apaga
                algo" — usar a mesma cor aqui gastaria o alarme à toa. */}
            <TriangleMark aria-hidden="true" className="h-12 w-12 text-sun" />

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-sun-ink">
                Erro 404
            </p>
            <h1 className="mt-3 text-3xl text-ink-900 sm:text-4xl">
                Esta página não existe
            </h1>
            <p className="mt-4 max-w-md text-[0.9375rem] text-muted">
                O endereço pode ter mudado, ou o link que você seguiu pode estar
                incompleto. Escolha por onde continuar.
            </p>

            <Button to="/" size="lg" className="mt-8">
                Ir para a página inicial
            </Button>

            <nav aria-label="Outras páginas" className="mt-10 w-full max-w-lg border-t border-line pt-8">
                <ul className="flex flex-wrap justify-center gap-2">
                    {PUBLIC_NAV.filter((item) => item.to !== '/').map((item) => (
                        <li key={item.to}>
                            <Button to={item.to} variant="secondary" size="sm">
                                {item.label}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </Container>
    );
}
