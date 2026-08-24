import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/Button';
import TriangleMark from '../ui/TriangleMark';
import logo from '../../assets/logo.png';
import { PUBLIC_NAV } from '../../lib/navigation';
import { CONTACT, ORGANIZATION } from '../../content/institutional';

/**
 * Rodapé.
 *
 * Ele lê `PUBLIC_NAV` — a MESMA lista que o menu do topo. No site antigo os
 * links do rodapé eram escritos à mão, então menu e rodapé podiam discordar
 * sobre quais páginas existem. Uma fonte só resolve isso de vez.
 *
 * O e-mail está com `mailto:` correto. No site antigo estava escrito
 * `malito:` — um typo silencioso: o link parecia funcionar, mas o navegador
 * não reconhecia o esquema e o clique não abria nada.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-ink-900 text-brand-100">
            {/* Faixa de chamada: o convite para o contato, que no site antigo
                era uma seção solta no meio do rodapé. */}
            <div className="border-b border-white/10">
                <Container>
                    <div className="flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
                        <div>
                            <h2 className="text-2xl text-white sm:text-3xl">Vamos conversar?</h2>
                            <p className="mt-2 max-w-md text-[0.9375rem] text-brand-200">
                                Dúvidas sobre os projetos, propostas de parceria ou vontade de ser
                                voluntário — a gente responde.
                            </p>
                        </div>
                        <Button to="/contato" variant="inverse" size="lg" className="shrink-0">
                            Falar com a ABRASCE
                        </Button>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    <div className="sm:col-span-2 lg:col-span-1">
                        {/* O logo é colorido sobre fundo claro; aqui vai numa
                            "pastilha" branca em vez de ser invertido por filtro
                            CSS, que sujaria os degradês do desenho. */}
                        <span className="inline-flex rounded-xl bg-white p-2.5">
                            <img src={logo} alt={ORGANIZATION.name} width={132} height={92} className="h-12 w-auto" loading="lazy" />
                        </span>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200">
                            {ORGANIZATION.fullName}
                        </p>
                        <p className="mt-3 text-xs text-brand-300/80">
                            CNPJ {ORGANIZATION.cnpj} · desde {ORGANIZATION.foundedYear}
                        </p>
                    </div>

                    <nav aria-label="Navegação do rodapé">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-aqua">
                            <TriangleMark className="h-2 w-2" />
                            Navegação
                        </h3>
                        <ul className="mt-4 space-y-1">
                            {PUBLIC_NAV.map((item) => (
                                <li key={item.to}>
                                    <Link
                                        to={item.to}
                                        className="flex min-h-10 items-center text-sm text-brand-100 transition-colors hover:text-white"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-aqua">
                            <TriangleMark className="h-2 w-2" />
                            Contato
                        </h3>
                        <ul className="mt-4 space-y-1">
                            <li>
                                <a
                                    href={`mailto:${CONTACT.email}`}
                                    className="flex min-h-10 items-center text-sm break-all text-brand-100 transition-colors hover:text-white"
                                >
                                    {CONTACT.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={CONTACT.phone.href}
                                    className="flex min-h-10 items-center text-sm text-brand-100 transition-colors hover:text-white"
                                >
                                    {CONTACT.phone.label}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-aqua">
                            <TriangleMark className="h-2 w-2" />
                            Endereços
                        </h3>
                        <div className="mt-4 space-y-4">
                            {CONTACT.addresses.map((address) => (
                                <address key={address.id} className="text-sm not-italic leading-relaxed text-brand-200">
                                    <span className="block font-semibold text-white">{address.label}</span>
                                    {address.lines.map((line) => (
                                        <span key={line} className="block">{line}</span>
                                    ))}
                                </address>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>

            <div className="border-t border-white/10">
                <Container>
                    <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-300/80 sm:flex-row">
                        <p>© {year} {ORGANIZATION.name}. Todos os direitos reservados.</p>
                        <Link to="/admin" className="flex min-h-10 items-center transition-colors hover:text-white">
                            Área restrita
                        </Link>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
