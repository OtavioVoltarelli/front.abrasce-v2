import { useState } from 'react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import ContactForm from '../../components/forms/ContactForm';
import { cn } from '../../lib/cn';
import { CONTACT } from '../../content/institutional';

/**
 * Contato.
 *
 * ---------------------------------------------------------------------------
 * A DECISÃO MAIS IMPORTANTE DESTA PÁGINA É DE PERFORMANCE
 * ---------------------------------------------------------------------------
 * A versão antiga carregava DOIS iframes do Google Maps de uma vez. Cada um
 * baixa por volta de 1 MB de JavaScript e faz dezenas de requisições. Eram
 * ~2 MB numa página cujo conteúdo real cabe em 20 KB — e, em celular com 4G
 * fraco, isso trava a página inteira enquanto carrega.
 *
 * Três medidas aqui:
 *
 *  1. UM mapa por vez, escolhido por abas. Metade do peso, e no celular ver
 *     dois mapas empilhados não ajudava ninguém mesmo.
 *  2. `loading="lazy"` no iframe: ele só começa a carregar quando chega perto
 *     da área visível. Quem só quer o telefone nunca paga por mapa nenhum.
 *  3. Um link "Abrir no Google Maps" ao lado. No celular ele abre o APLICATIVO
 *     do Maps, que já sabe traçar a rota a partir de onde a pessoa está —
 *     muito mais útil do que um mapinha embutido.
 *
 * Os canais diretos (telefone e e-mail) aparecem ANTES do formulário no
 * celular: quem quer ligar não deveria ter que rolar por seis campos primeiro.
 */
export default function Contact() {
    const [activeAddressId, setActiveAddressId] = useState(CONTACT.addresses[0].id);
    const activeAddress = CONTACT.addresses.find((address) => address.id === activeAddressId);

    return (
        <>
            <PageHeader
                eyebrow="Contato"
                title="Fale com a ABRASCE"
                description="Dúvidas sobre os projetos, propostas de parceria, trabalho voluntário ou doações — escolha o canal que preferir."
            />

            <Container className="py-12 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-12">
                    {/* ------------------------------------------ CANAIS ---- */}
                    {/* `order-1 lg:order-2`: no celular esta coluna vem primeiro;
                        no desktop ela vai para a direita, onde o olho procura
                        informação de apoio. A ordem NO HTML não muda — e é a do
                        HTML que vale para leitor de tela e navegação por teclado. */}
                    <aside className="order-1 space-y-4 lg:order-2">
                        <a
                            href={CONTACT.phone.href}
                            className="flex items-center gap-4 rounded-2xl bg-brand-600 p-5 text-white shadow-card transition-colors hover:bg-brand-700"
                        >
                            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15">
                                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                                </svg>
                            </span>
                            <span>
                                <span className="block text-xs font-bold uppercase tracking-wider text-brand-100">
                                    Telefone
                                </span>
                                <span className="block text-lg font-bold">{CONTACT.phone.label}</span>
                            </span>
                        </a>

                        <a
                            href={`mailto:${CONTACT.email}`}
                            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line transition-colors hover:bg-brand-50 hover:ring-brand-300"
                        >
                            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="m3 7 9 6 9-6" />
                                </svg>
                            </span>
                            <span className="min-w-0">
                                <span className="block text-xs font-bold uppercase tracking-wider text-muted">
                                    E-mail
                                </span>
                                <span className="block break-all text-[0.9375rem] font-bold text-ink-900">
                                    {CONTACT.email}
                                </span>
                            </span>
                        </a>

                        <div className="rounded-2xl bg-sand p-5 ring-1 ring-line">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                                Endereços
                            </h2>
                            <div className="mt-4 space-y-4">
                                {CONTACT.addresses.map((address) => (
                                    <address key={address.id} className="text-sm not-italic leading-relaxed text-ink-800">
                                        <span className="block font-bold text-ink-900">{address.label}</span>
                                        {address.lines.map((line) => (
                                            <span key={line} className="block">{line}</span>
                                        ))}
                                    </address>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ---------------------------------------- FORMULÁRIO -- */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-2xl text-ink-900 sm:text-3xl">Envie uma mensagem</h2>
                        <p className="mt-2 text-[0.9375rem] text-muted">
                            Preencha o formulário e a equipe responde pelo e-mail informado.
                        </p>

                        <div className="mt-7 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-7">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </Container>

            {/* --------------------------------------------------- MAPAS ---- */}
            <section className="bg-sand py-12 sm:py-16">
                <Container>
                    <h2 className="text-2xl text-ink-900 sm:text-3xl">Onde estamos</h2>

                    {/* Abas de verdade: `role="tablist"` + `aria-selected` fazem o
                        leitor de tela anunciar "aba 1 de 2, selecionada". Sem
                        isso são só dois botões sem relação aparente entre si. */}
                    <div role="tablist" aria-label="Escolha um endereço" className="mt-6 flex flex-wrap gap-2">
                        {CONTACT.addresses.map((address) => {
                            const isActive = address.id === activeAddressId;
                            return (
                                <button
                                    key={address.id}
                                    type="button"
                                    role="tab"
                                    id={`aba-${address.id}`}
                                    aria-selected={isActive}
                                    aria-controls={`painel-${address.id}`}
                                    onClick={() => setActiveAddressId(address.id)}
                                    className={cn(
                                        'min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors',
                                        isActive
                                            ? 'bg-brand-600 text-white shadow-card'
                                            : 'bg-white text-ink-800 ring-1 ring-inset ring-line hover:bg-brand-50'
                                    )}
                                >
                                    {address.label}
                                </button>
                            );
                        })}
                    </div>

                    <div
                        role="tabpanel"
                        id={`painel-${activeAddress.id}`}
                        aria-labelledby={`aba-${activeAddress.id}`}
                        className="mt-5"
                    >
                        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
                            <address className="text-sm not-italic leading-relaxed text-ink-800">
                                {activeAddress.lines.map((line) => (
                                    <span key={line} className="block">{line}</span>
                                ))}
                            </address>

                            <a
                                href={activeAddress.mapLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-50 px-5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100"
                            >
                                Abrir no Google Maps
                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                                </svg>
                            </a>
                        </div>

                        <iframe
                            // `key` força o React a recriar o iframe ao trocar de
                            // aba. Sem isso ele só trocaria o `src`, e o histórico
                            // interno do mapa faria o botão "voltar" do navegador
                            // passar pelos mapas antes de sair da página.
                            key={activeAddress.id}
                            src={activeAddress.mapSrc}
                            title={`Mapa — ${activeAddress.label}`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                            className="mt-4 h-72 w-full rounded-2xl border-0 bg-line shadow-card sm:h-96"
                        />
                    </div>
                </Container>
            </section>
        </>
    );
}
