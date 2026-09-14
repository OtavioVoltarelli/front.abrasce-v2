import { useEffect, useRef, useState } from 'react';
import { Tree } from 'react-arborist';
import { FaFilePdf, FaFolder, FaFolderOpen } from 'react-icons/fa';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/feedback/ErrorState';
import EmptyState from '../../components/feedback/EmptyState';
import { useTransparencyTree } from '../../hooks/useTransparency';
import { transparencyFileUrl } from '../../services/transparencyService';
import { TRANSPARENCY_TEXT } from '../../content/institutional';

/**
 * Transparência.
 *
 * ---------------------------------------------------------------------------
 * ESCOPO: conforme combinado, esta página NÃO foi redesenhada. A estrutura
 * (texto institucional + árvore de arquivos do react-arborist) e o
 * comportamento são os mesmos. O que mudou foi a troca do CSS por Tailwind —
 * MAIS DOIS DEFEITOS que não dava para deixar passar:
 *
 *  1. `width={1800} height={800}` fixos na árvore. Mil e oitocentos pixels de
 *     largura numa tela de 360px significam barra de rolagem horizontal na
 *     página inteira — o item da lista de "nunca faça" do próprio briefing.
 *     Agora a largura é MEDIDA do container e a altura se adapta à tela.
 *
 *  2. `window.open('http://localhost:8080/api/files/...')` com o endereço
 *     escrito à mão dentro do componente. Isso funciona só na máquina de
 *     desenvolvimento: publicado, nenhum documento abriria. Agora usa
 *     `transparencyFileUrl`, que monta a URL a partir da variável de ambiente.
 *
 * O SINAL QUE DENUNCIAVA OS DOIS: número mágico grande (1800) e "localhost"
 * dentro de um componente. Nenhum dos dois sobrevive ao mundo real.
 */

/**
 * Ícone e rótulo de cada linha da árvore.
 *
 * `event.stopPropagation()` no clique é OBRIGATÓRIO aqui, não estilo. Este
 * `<div>` fica dentro do `<div>` que o próprio react-arborist desenha pra
 * linha, e aquele `<div>` de fora já tem seu PRÓPRIO `onClick`
 * (`node.handleClick`, definido na lib) que faz `select()` + `activate()`
 * sozinho. Sem parar a propagação, um clique dispara os dois: o nosso
 * `activate()` aqui embaixo, e o `handleClick` da lib lá em cima — cada um
 * chamando `onActivate` (que abre o PDF), duas vezes. Era exatamente isso
 * que abria duas guias por clique.
 */
function TreeNode({ node, style, dragHandle }) {
    const isFolder = node.isInternal;

    return (
        <div
            ref={dragHandle}
            style={style}
            onClick={(event) => {
                event.stopPropagation();
                node.select();
                if (isFolder) node.toggle();
                else node.activate();
            }}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 text-white/90 transition-colors hover:bg-white/10"
        >
            {isFolder ? (
                <>
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className={`size-3.5 shrink-0 text-white/50 transition-transform ${node.isOpen ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m7 4 6 6-6 6" />
                    </svg>
                    {node.isOpen
                        ? <FaFolderOpen aria-hidden="true" className="size-4 shrink-0 text-amber-400" />
                        : <FaFolder aria-hidden="true" className="size-4 shrink-0 text-amber-400" />}
                </>
            ) : (
                <>
                    <span aria-hidden="true" className="w-3.5 shrink-0" />
                    <FaFilePdf aria-hidden="true" className="size-4 shrink-0 text-red-400" />
                </>
            )}

            <span className="truncate text-sm">{node.data.name}</span>
        </div>
    );
}

/**
 * Mede a largura de um elemento e a mantém atualizada quando ele muda de
 * tamanho (girar o celular, redimensionar a janela).
 *
 * O `ResizeObserver` é a ferramenta certa para isso: ele observa o ELEMENTO,
 * não a janela. Um listener de `resize` na janela não perceberia, por exemplo,
 * a barra de rolagem aparecendo e estreitando o container.
 */
function useElementWidth() {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return [ref, width];
}

export default function Transparency() {
    const { data, isPending, isError, error, refetch } = useTransparencyTree();
    const [containerRef, containerWidth] = useElementWidth();

    return (
        <>
            <PageHeader accent="lagoon" eyebrow="Prestação de contas" title="Transparência" />

            <section className="bg-ink-900 pb-14 sm:pb-20">
                <Container size="narrow">
                    <div className="space-y-4 pb-10">
                        {TRANSPARENCY_TEXT.map((paragraph) => (
                            <p key={paragraph.slice(0, 40)} className="text-[0.9375rem] leading-[1.8] text-brand-200 sm:text-base">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div ref={containerRef} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 sm:p-5">
                        <h2 className="px-2 pb-3 text-sm font-bold uppercase tracking-wider text-aqua">
                            Documentos
                        </h2>

                        {isPending && (
                            <div className="flex justify-center py-16">
                                <Spinner label="Carregando os documentos" />
                            </div>
                        )}

                        {isError && (
                            <div className="py-6">
                                <ErrorState
                                    title="Não foi possível carregar os documentos"
                                    error={error}
                                    onRetry={() => refetch()}
                                />
                            </div>
                        )}

                        {!isPending && !isError && !data?.length && (
                            <div className="py-6">
                                <EmptyState
                                    title="Nenhum documento publicado ainda"
                                    description="Os relatórios, balanços e certidões aparecem aqui assim que forem enviados."
                                />
                            </div>
                        )}

                        {/* A árvore só é montada depois que a largura foi medida.
                            Renderizar com width={0} faria as linhas nascerem sem
                            largura e piscarem ao receber a medida certa. */}
                        {!isPending && !isError && data?.length > 0 && containerWidth > 0 && (
                            <Tree
                                initialData={data}
                                openByDefault={false}
                                disableDrag
                                disableEdit
                                disableMultiSelection
                                /* 44px por linha: alvo de toque confortável.
                                   O valor anterior, 40, já ficava no limite. */
                                rowHeight={44}
                                indent={20}
                                width={containerWidth - 24}
                                height={Math.min(560, Math.max(320, (data.length + 4) * 44))}
                                onActivate={(node) => {
                                    if (node.isLeaf) {
                                        window.open(transparencyFileUrl(node.id), '_blank', 'noopener,noreferrer');
                                    }
                                }}
                            >
                                {TreeNode}
                            </Tree>
                        )}
                    </div>
                </Container>
            </section>
        </>
    );
}
