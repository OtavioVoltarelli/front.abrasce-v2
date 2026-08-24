import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import ProjectCard from '../../components/cards/ProjectCard';
import TriangleMark from '../../components/ui/TriangleMark';
import Button from '../../components/ui/Button';
import { AREAS, areaVars } from '../../content/areas';
import { PROJECTS, PROJECT_CITIES, projectsByArea } from '../../content/projects';
import { PROJECTS_TAGLINE } from '../../content/institutional';

/**
 * Projetos.
 *
 * ---------------------------------------------------------------------------
 * O QUE MUDOU
 * ---------------------------------------------------------------------------
 * A página antiga era uma pilha de seis blocos "texto + foto" iguais, e os
 * links levavam a páginas (`/projetos/esporte`, `/projetos/cultura`…) que
 * mostravam só nome, cidade e logo de cada projeto — pouco conteúdo espalhado
 * por seis rotas, com quatro delas repetindo o mesmo projeto.
 *
 * Aqui tudo vive numa página só, com âncoras (`/projetos#esporte`). Ganhos:
 *  · Menos toques para ver tudo. No celular, cada navegação é uma espera.
 *  · Os projetos reais aparecem DENTRO da área a que pertencem, em vez de
 *    numa página separada que quase ninguém abria.
 *  · O menu de áreas no topo funciona como índice — e como âncora, o link
 *    continua compartilhável.
 *
 * Todo o texto das seis áreas é o ORIGINAL da página antiga, integral.
 */
export default function Projects() {
    return (
        <>
            <PageHeader eyebrow="Projetos" title={PROJECTS_TAGLINE}>
                <p className="text-sm text-brand-200">
                    {PROJECTS.length} projetos ativos em {PROJECT_CITIES.length} municípios:{' '}
                    {PROJECT_CITIES.join(', ')}.
                </p>
            </PageHeader>

            {/* ------------------------------------------ ÍNDICE DAS ÁREAS -- */}
            {/* `sticky` gruda o índice logo abaixo da navbar enquanto a pessoa
                rola. Numa página longa como esta, é o que evita ter que voltar
                ao topo para trocar de área. */}
            <nav
                aria-label="Áreas de atuação"
                className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur sm:top-18"
            >
                <Container size="wide">
                    {/* Rolagem horizontal APENAS aqui dentro, nunca na página.
                        `-mx-5 px-5` faz o primeiro e o último item encostarem
                        na margem, sinalizando que a lista continua. */}
                    <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {AREAS.map((area) => (
                            <li key={area.slug}>
                                <a
                                    href={`#${area.slug}`}
                                    style={areaVars(area)}
                                    className="flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full bg-sand px-4 text-sm font-semibold text-ink-800 transition-colors hover:bg-[var(--area-tint)] hover:text-[var(--area-ink)]"
                                >
                                    <span aria-hidden="true" className="size-2 rounded-full bg-[var(--area)]" />
                                    {area.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Container>
            </nav>

            {/* ------------------------------------------------- AS ÁREAS --- */}
            {AREAS.map((area, index) => {
                const projects = projectsByArea(area.slug);
                // Fundo alternado: separa as seções sem precisar de linha
                // divisória nem de moldura em cada bloco.
                const isAlternate = index % 2 === 1;

                return (
                    <section
                        key={area.slug}
                        id={area.slug}
                        style={areaVars(area)}
                        className={`scroll-mt-32 py-12 sm:py-16 ${isAlternate ? 'bg-sand' : 'bg-white'}`}
                    >
                        <Container>
                            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
                                <div className={isAlternate ? 'lg:order-2' : undefined}>
                                    <img
                                        src={area.image}
                                        alt={area.imageAlt}
                                        loading="lazy"
                                        decoding="async"
                                        className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card"
                                    />
                                </div>

                                <div className={isAlternate ? 'lg:order-1' : undefined}>
                                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--area-ink)]">
                                        <TriangleMark className="h-2.5 w-2.5" />
                                        {area.label}
                                    </p>

                                    <h2 className="mt-3 text-2xl text-ink-900 sm:text-3xl lg:text-4xl">
                                        {area.projectTitle}
                                    </h2>

                                    <p className="mt-4 text-[0.9375rem] leading-[1.8] text-ink-800 sm:text-base">
                                        {area.description}
                                    </p>

                                    {/* Só aparece se houver projeto cadastrado nesta
                                        área — nada de "Projetos: nenhum". */}
                                    {projects.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
                                                {projects.length === 1
                                                    ? 'Projeto nesta área'
                                                    : `Projetos nesta área (${projects.length})`}
                                            </h3>
                                            <ul className="mt-4 space-y-3">
                                                {projects.map((project) => (
                                                    <li key={project.slug}>
                                                        <ProjectCard project={project} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Container>
                    </section>
                );
            })}

            {/* ----------------------------------------------------- FAIXA -- */}
            <section className="bg-ink-900 py-12 sm:py-16">
                <Container>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <h2 className="text-2xl text-white sm:text-3xl">
                                Quer levar um projeto para a sua cidade?
                            </h2>
                            <p className="mt-3 text-[0.9375rem] text-brand-200">
                                Fale com a equipe da ABRASCE sobre parcerias, apoio institucional
                                ou trabalho voluntário.
                            </p>
                        </div>
                        <Button to="/contato" variant="inverse" size="lg" className="shrink-0 self-start lg:self-auto">
                            Entrar em contato
                        </Button>
                    </div>
                </Container>
            </section>
        </>
    );
}
