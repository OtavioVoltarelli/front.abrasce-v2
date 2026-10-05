import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import Container from '../../components/ui/Container';
import Button from '../../components/ui/Button';
import TriangleMark from '../../components/ui/TriangleMark';
import SectionHeading from '../../components/ui/SectionHeading';
import AreaRange from '../../components/AreaRange';
import AreaCard from '../../components/cards/AreaCard';
import NewsCard from '../../components/cards/NewsCard';
import QueryBoundary from '../../components/feedback/QueryBoundary';
import Skeleton from '../../components/feedback/Skeleton';
import { useLatestNews } from '../../hooks/useNews';
import { AREAS, areaVars } from '../../content/areas';
import { accentVars } from '../../lib/palette';
import { ABOUT, MISSION, VISION, VALUES, ORGANIZATION } from '../../content/institutional';

/**
 * Página inicial.
 *
 * ---------------------------------------------------------------------------
 * O QUE SAIU: O CARROSSEL
 * ---------------------------------------------------------------------------
 * A Home antiga abria com um carrossel de três imagens. Ele foi removido, e
 * a razão vale para qualquer projeto:
 *
 *  · As três imagens eram banners com o TEXTO DESENHADO DENTRO DO PIXEL
 *    ("VAGAS EM ABERTO", "CONFIRA NOSSAS NOTÍCIAS"). Texto dentro de imagem
 *    não redimensiona — num celular de 360px aquele banner de 2000px de largura
 *    fica com letras minúsculas. Leitor de tela não lê. Buscador não indexa.
 *  · As três somavam 2 MB. A maior sozinha tinha 1,3 MB, mais que todo o resto
 *    do site junto. Em 4G ruim isso é a diferença entre abrir e desistir.
 *  · Carrossel que troca sozinho a cada 5 segundos rouba o conteúdo de quem
 *    lê devagar, e quase ninguém vê o segundo slide.
 *
 * No lugar entrou um hero tipográfico: ele aparece INSTANTANEAMENTE, porque
 * não depende de nenhuma imagem baixar.
 *
 * TODO O TEXTO INSTITUCIONAL É O ORIGINAL, palavra por palavra
 * (ver src/content/institutional.js).
 */
export default function Home() {
    const latestNews = useLatestNews(3);

    return (
        <>
            {/* ================================================== HERO ===== */}
            <section className="relative overflow-hidden bg-ink-900">
                {/* Assinatura: o triângulo do logo, gigante e cortado pela borda.
                    Fica em opacidade baixíssima — é textura, não desenho. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <TriangleMark
                        className="absolute -right-24 -top-28 h-[26rem] w-[26rem] opacity-[0.06] sm:-right-10 sm:h-[34rem] sm:w-[34rem]"
                        color="white"
                    />
                    {/* Três brilhos de cores diferentes em vez de dois azuis.
                        Em opacidade baixa e muito desfocados eles não leem como
                        "manchas coloridas" — leem como profundidade. É o que
                        tira o fundo escuro do azul chapado sem custar contraste
                        nenhum ao texto branco por cima. */}
                    <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-brand-600 opacity-30 blur-[100px]" />
                    <div className="absolute right-1/4 -bottom-24 h-72 w-72 rounded-full bg-iris opacity-25 blur-[90px]" />
                    <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-lagoon opacity-20 blur-[80px]" />
                </div>

                <Container className="relative">
                    <div className="pb-14 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
                        <p className="max-w-lg text-xs font-bold uppercase leading-relaxed tracking-[0.14em] text-aqua">
                            {ORGANIZATION.fullName}
                        </p>

                        <h1 className="mt-5 max-w-4xl text-[2.25rem] leading-[1.04] text-white sm:text-6xl lg:text-7xl">
                            Promover o bem-estar e a inclusão social.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-200 sm:text-xl">
                            Por meio de iniciativas que atendam às necessidades da comunidade,
                            oferecendo suporte em saúde, educação e cultura.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Button to="/projetos" variant="inverse" size="lg">
                                Conheça nossos projetos
                            </Button>
                            <Button to="/trabalhe-conosco" variant="outlineInverse" size="lg">
                                Trabalhe conosco
                            </Button>
                        </div>

                        {/* Atalho para as seis áreas. Aparece já no primeiro
                            scroll: quem chega pelo Google procurando "projeto de
                            esporte" tem o caminho direto, sem ler a página toda. */}
                        <ul className="mt-11 flex flex-wrap gap-2">
                            {AREAS.map((area) => (
                                <li key={area.slug}>
                                    <Link
                                        to={`/projetos#${area.slug}`}
                                        style={areaVars(area)}
                                        className="relative flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 transition-[color,background-color,box-shadow,transform] duration-200 ease-out hover:bg-white/15 hover:text-[var(--area-bright)] hover:ring-[var(--area-bright)]/40 focus-visible:text-[var(--area-bright)] hover:z-10 motion-safe:hover:scale-110"
                                    >
                                        {/* Na cor: `--area-bright`, não `--area`.
                                            A cor cheia (ex.: o roxo #8B5CF6) não
                                            tem contraste suficiente como TEXTO
                                            sobre o azul-marinho; a versão
                                            `bright` é a aprovada para isso.
                                            No tamanho: `scale` em vez de
                                            `font-size` — transform não empurra
                                            as etiquetas vizinhas. Em 110% ela
                                            invade um pouco o vão entre elas;
                                            `hover:z-10` a põe por cima em vez
                                            de por baixo da vizinha. */}
                                        <span aria-hidden="true" className="size-2 rounded-full bg-[var(--area)]" />
                                        {area.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>

                {/* A serra: seis picos, um por área, na divisa entre o hero e a
                    página. É o elemento que dá identidade ao site. */}
                <AreaRange className="h-5 sm:h-8" />
            </section>

            {/* ============================================ QUEM SOMOS ===== */}
            <section className="bg-white py-14 sm:py-20">
                {/* Duas colunas só no desktop: texto à esquerda, logo à direita.
                    No celular o logo vem antes do título — `lg:order-last` o
                    manda para a direita sem duplicar marcação. O texto mantém
                    `max-w-2xl` para a linha não ficar longa demais de ler. */}
                <Container className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center lg:gap-16">
                    {/* alt vazio: o parágrafo ao lado já começa com o nome
                        completo da ABRASCE; descrever o logo faria o leitor de
                        tela repetir a mesma informação. */}
                    <img
                        src={logo}
                        alt=""
                        width={452}
                        height={320}
                        loading="lazy"
                        className="mb-8 h-auto w-40 sm:w-48 lg:order-last lg:mb-0 lg:w-full"
                    />

                    <div className="max-w-2xl">
                        <SectionHeading eyebrow="Quem somos" title={ABOUT.heading} level={2} />
                        <p className="mt-6 text-[1.0625rem] leading-[1.8] text-ink-800">
                            {ABOUT.text}
                        </p>
                    </div>
                </Container>
            </section>

            {/* ============================== MISSÃO, VISÃO E VALORES ====== */}
            <section className="bg-white py-14 sm:py-20">
                <Container>
                    <SectionHeading
                        eyebrow="O que nos guia"
                        title="Missão, visão e valores"
                        accent="iris"
                        level={2}
                    />

                    {/* Os três cards eram brancos com o mesmo triângulo azul.
                        Agora cada um tem o seu acento — âmbar para a Missão,
                        turquesa para a Visão, azul-marinho para os Valores.
                        A cor não muda a informação; ela dá ao olho três blocos
                        distinguíveis de relance, em vez de três retângulos
                        iguais que precisam ser lidos para serem diferenciados.
                        O `ring-black/5` substitui o `ring-line` (azulado):
                        uma borda azul em volta de um card âmbar denunciava que
                        a cor tinha sido "pintada por cima" de um card azul. */}
                    <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:gap-6">
                        {[
                            { block: MISSION, accent: 'sun' },
                            { block: VISION, accent: 'lagoon' },
                        ].map(({ block, accent }) => (
                            <article
                                key={block.heading}
                                style={accentVars(accent)}
                                className="rounded-2xl bg-[var(--accent-tint)] p-6 shadow-card ring-1 ring-black/5 sm:p-7"
                            >
                                <TriangleMark className="h-5 w-5 text-[var(--accent)]" color="currentColor" />
                                <h3 className="mt-4 text-xl text-ink-900">{block.heading}</h3>
                                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-800/85">
                                    {block.text}
                                </p>
                            </article>
                        ))}

                        {/* Os valores em <dl>: cada um é um par nome + definição.
                            No site antigo eram cinco parágrafos com <strong> na
                            frente. A lista de definições diz ao leitor de tela
                            que "Compromisso" é o TERMO e o resto é a DEFINIÇÃO —
                            o negrito sozinho não diz nada disso. */}
                        <article className="rounded-2xl bg-ink-900 p-6 text-white shadow-card sm:p-7">
                            <TriangleMark className="h-5 w-5 text-aqua" color="currentColor" />
                            <h3 className="mt-4 text-xl">{VALUES.heading}</h3>
                            <dl className="mt-4 space-y-3">
                                {VALUES.items.map((value) => (
                                    <div key={value.name}>
                                        <dt className="text-sm font-bold text-aqua">{value.name}</dt>
                                        <dd className="text-sm leading-relaxed text-brand-200">{value.text}</dd>
                                    </div>
                                ))}
                            </dl>
                        </article>
                    </div>
                </Container>
            </section>

            {/* ========================================= ÁREAS DE ATUAÇÃO == */}
            <section className="bg-white py-14 sm:py-20">
                <Container>
                    <SectionHeading
                        eyebrow="Onde atuamos"
                        accent="lagoon"
                        title="Campos em que atuamos"
                        description="Seis frentes de trabalho, cada uma com projetos próprios nos municípios onde a ABRASCE está presente."
                        level={2}
                    />

                    {/* Uma coluna no celular, duas no tablet, três no notebook.
                        Começar por uma coluna é o "mobile first" na prática:
                        `grid-cols-1` é o padrão e cada breakpoint só ACRESCENTA. */}
                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {AREAS.map((area) => (
                            <AreaCard key={area.slug} area={area} to={`/projetos#${area.slug}`} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* =============================================== NOTÍCIAS ==== */}
            {/* Fundo coral bem claro — a mesma família de cor da data e do
                "Ler notícia" nos cards, e da página de Notícias inteira. */}
            <section className="bg-coral-tint py-14 sm:py-20">
                <Container>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <SectionHeading
                            eyebrow="Acontece na ABRASCE"
                            title="Últimas notícias"
                            accent="coral"
                            level={2}
                            className="flex-1"
                        />
                        <Button to="/noticias" variant="secondary" className="self-start sm:self-auto">
                            Ver todas as notícias
                        </Button>
                    </div>

                    <div className="mt-10">
                        <QueryBoundary
                            query={latestNews}
                            errorTitle="Não foi possível carregar as notícias"
                            skeleton={
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                                    {[0, 1, 2].map((index) => (
                                        <div key={index} className="overflow-hidden rounded-2xl bg-white p-0 shadow-card ring-1 ring-line">
                                            <Skeleton className="aspect-[16/9] rounded-none" />
                                            <div className="space-y-3 p-5">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-5 w-full" />
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                            empty={{
                                title: 'Ainda não há notícias publicadas',
                                description: 'Assim que a ABRASCE publicar a primeira notícia, ela aparece aqui.',
                            }}
                        >
                            {(news) => (
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                                    {news.map((item) => (
                                        <NewsCard key={item.id} news={item} />
                                    ))}
                                </div>
                            )}
                        </QueryBoundary>
                    </div>
                </Container>
            </section>

            {/* ================================================== FAIXA ==== */}
            {/* A faixa é VERDE porque leva a Trabalhe conosco, e Trabalhe
                conosco é a página verde. Antes ela era azul como tudo o mais,
                e não dava nenhuma pista de para onde ia. O degradê usa só tons
                escuros o bastante para o texto branco de 15px passar em 4.5:1
                em qualquer ponto dele — um verde mais vivo seria mais bonito e
                deixaria o subtítulo ilegível. */}
            <section className="relative overflow-hidden bg-[linear-gradient(120deg,var(--color-leaf-deep)_0%,var(--color-leaf-ink)_55%,var(--color-lagoon-ink)_100%)]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <TriangleMark className="absolute -bottom-24 -left-16 h-80 w-80 opacity-10" color="white" />
                </div>
                <Container className="relative">
                    <div className="flex flex-col gap-6 py-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <h2 className="text-2xl text-white sm:text-4xl">
                                Faça parte da equipe
                            </h2>
                            <p className="mt-3 text-[0.9375rem] text-white/80 sm:text-lg">
                                Os processos seletivos abertos, com edital completo e inscrição
                                pelo próprio site.
                            </p>
                        </div>
                        <Button to="/trabalhe-conosco" variant="inverse" size="lg" className="shrink-0 self-start lg:self-auto">
                            Ver vagas abertas
                        </Button>
                    </div>
                </Container>
            </section>
        </>
    );
}
