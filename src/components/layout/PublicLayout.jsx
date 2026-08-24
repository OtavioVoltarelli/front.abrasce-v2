import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Moldura de todas as páginas públicas: navbar em cima, conteúdo no meio,
 * rodapé embaixo.
 *
 * `<Outlet />` é onde o React Router encaixa a página da rota atual. Antes,
 * cada rota era listada com <Navbar /> e <Footer /> por fora, no arquivo de
 * rotas; com um layout, a moldura fica declarada uma vez e o painel admin
 * poderá ter a sua própria sem gambiarra.
 *
 * `min-h-dvh` (e não `min-h-screen`): `dvh` é a altura VISÍVEL da janela no
 * celular, descontando a barra de endereço que aparece e some ao rolar. `vh`
 * ignora isso e sempre gera uma sobra de uns 60px no fim da página.
 */
export default function PublicLayout() {
    const { pathname, hash } = useLocation();

    /*
     * Rolagem ao trocar de rota.
     *
     * Numa navegação de página inteira o navegador cuida disso sozinho; num
     * app de página única, não — sem isto, abrir uma notícia a partir do fim
     * da lista te deixa no meio do texto.
     *
     * O `hash` está nas dependências por causa de um bug que a primeira versão
     * tinha: ir da Home para `/projetos#esporte` rolava para o TOPO de
     * Projetos, ignorando a âncora. Motivo: só o `pathname` era observado, e o
     * React Router não rola até a âncora sozinho. Agora, quando existe hash,
     * a rolagem vai para o elemento correspondente.
     *
     * O `requestAnimationFrame` espera o próximo quadro: no primeiro acesso a
     * um endereço com âncora, o arquivo daquela página ainda está sendo
     * baixado, e o elemento-alvo não existe no instante em que o efeito roda.
     */
    useEffect(() => {
        const targetId = hash ? decodeURIComponent(hash.slice(1)) : null;

        const frame = requestAnimationFrame(() => {
            const target = targetId ? document.getElementById(targetId) : null;

            if (target) {
                target.scrollIntoView({ behavior: 'instant', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [pathname, hash]);

    return (
        <div className="flex min-h-dvh flex-col bg-white">
            <Navbar />
            <main id="conteudo" className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
