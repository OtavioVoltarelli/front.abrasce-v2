/**
 * Gera as fotos das seis áreas de atuação no formato que o site usa.
 *
 *   npm run images:areas
 *
 * Lê as originais em `fotos-originais/areas/` (fora do git — cada uma tem
 * vários MB) e grava em `src/assets/areas/`, para cada foto:
 *
 *   <slug>-800w.webp   <slug>-1200w.webp   <slug>-1600w.webp
 *   <slug>-800w.jpg    <slug>-1200w.jpg    <slug>-1600w.jpg
 *
 * POR QUE 3:2
 * As molduras do site (card da Home e página Projetos) são 3:2. Com a foto no
 * MESMO formato da moldura, o `object-cover` não tem nada para cortar — e
 * quem decide o que fica de fora é este script, olhando a foto, e não o CSS
 * cortando o centro às cegas. Foto mais larga ou mais alta que 3:2 é cortada
 * aqui, do lado indicado em `CROP_POSITION`.
 *
 * POR QUE TRÊS LARGURAS
 * O `srcset` deixa o navegador baixar só a que a tela precisa: 800 para card
 * pequeno, 1200 para a maioria dos celulares (390px de tela × densidade 3),
 * 1600 para tablet. A maior moldura do site tem ~980px de CSS.
 *
 * POR QUE WEBP + JPEG
 * O WebP é ~25% menor que o JPEG com a mesma qualidade e é o que quase todo
 * navegador baixa; o JPEG fica de reserva no <img> do <picture>.
 *
 * Para trocar uma foto: substitua o arquivo em `fotos-originais/areas/`
 * (mesmo nome do slug) e rode o script de novo.
 */
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = 'fotos-originais/areas';
const OUTPUT_DIR = 'src/assets/areas';

const ASPECT_RATIO = 3 / 2;
const WIDTHS = [800, 1200, 1600];

/* Qualidade 78: nos testes com estas fotos (folhagem do lazer, fantasias da
   cultura), a diferença para a referência sem compressão não aparece nem em
   recorte ampliado. Abaixo de ~70 a folhagem começa a borrar. */
const JPEG_OPTIONS = { quality: 78, mozjpeg: true, progressive: true };
const WEBP_OPTIONS = { quality: 78, effort: 6 };

/* De que lado cortar quando a original não é 3:2. O padrão é o centro.
   Esporte é 16:9: o corte tira a parede vazia da esquerda e mantém todos os
   jogadores, a bola e o gol. */
const CROP_POSITION = {
    esporte: 'right',
};

async function cropToAspectRatio(file, slug) {
    // `rotate()` sem argumento aplica a orientação gravada pela câmera (EXIF).
    // Sem isso, foto tirada com o celular em pé pode sair deitada.
    const image = sharp(file).rotate();
    const { width, height } = await image.metadata();

    const cropWidth = Math.min(width, Math.round(height * ASPECT_RATIO));
    const cropHeight = Math.round(cropWidth / ASPECT_RATIO);

    return image.resize(cropWidth, cropHeight, {
        fit: 'cover',
        position: CROP_POSITION[slug] ?? 'centre',
    });
}

async function optimizePhoto(fileName) {
    const slug = path.parse(fileName).name;
    const cropped = await (await cropToAspectRatio(path.join(INPUT_DIR, fileName), slug)).toBuffer();

    const sizes = [];
    for (const width of WIDTHS) {
        const resized = sharp(cropped).resize({ width, withoutEnlargement: true });
        const base = path.join(OUTPUT_DIR, `${slug}-${width}w`);
        const [jpeg, webp] = await Promise.all([
            resized.clone().jpeg(JPEG_OPTIONS).toFile(`${base}.jpg`),
            resized.clone().webp(WEBP_OPTIONS).toFile(`${base}.webp`),
        ]);
        sizes.push(`${width}w: webp ${Math.round(webp.size / 1024)} KB, jpg ${Math.round(jpeg.size / 1024)} KB`);
    }
    console.log(`${slug}\n  ${sizes.join('\n  ')}`);
}

await mkdir(OUTPUT_DIR, { recursive: true });
const originals = (await readdir(INPUT_DIR)).filter((name) => /\.(jpe?g|png|webp)$/i.test(name));

if (originals.length === 0) {
    console.error(`Nenhuma foto em ${INPUT_DIR}/. As originais ficam fora do git.`);
    process.exit(1);
}

for (const fileName of originals) await optimizePhoto(fileName);
