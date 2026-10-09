/**
 * Foto responsiva: o navegador escolhe o FORMATO e a LARGURA sozinho.
 *
 * · Formato: o <source type="image/webp"> vem primeiro, e o navegador pega o
 *   primeiro que entende. Quase todos ficam com o WebP (mais leve); o JPEG do
 *   <img> é a reserva.
 * · Largura: `srcSet` lista as versões ("url 800w, url 1200w...") e `sizes`
 *   diz quanto da tela a foto ocupa. Com os dois, o navegador calcula a
 *   largura necessária — já contando a densidade da tela — e baixa só a
 *   versão que basta. Um celular nunca baixa a de tablet.
 *
 * `sizes` é obrigatório e depende do LAYOUT de quem usa: só quem usa sabe se
 * a foto ocupa a tela inteira ou um terço dela.
 *
 * `image` vem de `lib/responsiveImage`. O `className` vai no <img>: o
 * <picture> é só um invólucro de escolha, quem aparece na tela é o <img>.
 */
export default function ResponsivePicture({ image, alt, sizes, className, loading = 'lazy' }) {
    return (
        <picture>
            <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
            <img
                src={image.src}
                srcSet={image.jpegSrcSet}
                sizes={sizes}
                alt={alt}
                width={image.width}
                height={image.height}
                loading={loading}
                decoding="async"
                className={className}
            />
        </picture>
    );
}
