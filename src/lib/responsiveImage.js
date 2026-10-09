/**
 * Monta os dados de um <picture> responsivo a partir das versões geradas por
 * `scripts/optimize-area-photos.mjs` (`<nome>-<largura>w.<jpg|webp>`).
 *
 * `files` é o resultado de um `import.meta.glob(..., { eager: true, import:
 * 'default' })`: um objeto { caminho do arquivo: URL final do build }. O glob
 * existe para não precisar de 36 `import` escritos à mão — e para que gerar
 * uma largura nova no script não exija mexer em código.
 *
 * Devolve:
 *   webpSrcSet / jpegSrcSet  "url 800w, url 1200w, url 1600w" — o navegador
 *                            escolhe a largura pelo `sizes` e pela densidade
 *                            da tela
 *   src                      o JPEG do meio, para navegador sem `srcset`
 *   width / height           proporção real da foto, para o <img> reservar o
 *                            espaço antes de baixar (sem layout shift)
 */
const VARIANT_PATTERN = /\/([^/]+)-(\d+)w\.(jpg|webp)$/;

export function responsiveImage(files, name) {
    const variants = Object.entries(files)
        .map(([filePath, url]) => {
            const match = filePath.match(VARIANT_PATTERN);
            return match && { name: match[1], width: Number(match[2]), format: match[3], url };
        })
        .filter((variant) => variant?.name === name)
        .sort((a, b) => a.width - b.width);

    // Falha alto e cedo: sem isso, uma foto que não foi gerada vira um <img>
    // quebrado silencioso no meio da página.
    if (variants.length === 0) {
        throw new Error(`Foto "${name}" não encontrada. Rode \`npm run images:areas\`.`);
    }

    const ofFormat = (format) => variants.filter((variant) => variant.format === format);
    const toSrcSet = (list) => list.map((variant) => `${variant.url} ${variant.width}w`).join(', ');

    const jpegs = ofFormat('jpg');
    const fallback = jpegs[Math.floor(jpegs.length / 2)];

    return {
        webpSrcSet: toSrcSet(ofFormat('webp')),
        jpegSrcSet: toSrcSet(jpegs),
        src: fallback.url,
        // Só a PROPORÇÃO importa aqui (o CSS define o tamanho). Igual ao
        // ASPECT_RATIO do script: toda foto gerada sai em 3:2.
        width: 3,
        height: 2,
    };
}
