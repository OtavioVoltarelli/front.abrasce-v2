import { AREAS } from '../content/areas';

/**
 * A "serra": os seis triângulos do logo, um por área de atuação, formando uma
 * cadeia de montanhas na divisa entre duas seções.
 *
 * É o elemento de assinatura do site. Ele não é enfeite aleatório por dois
 * motivos: a forma vem do próprio logo da ABRASCE, e a quantidade de picos e
 * as cores vêm da estrutura real da organização — seis áreas, seis cores, na
 * mesma ordem em que aparecem no resto do site.
 *
 * Um SVG só, sem imagem para baixar, escalando em qualquer largura.
 * `preserveAspectRatio="none"` deixa a serra esticar horizontalmente: num
 * celular estreito ela fica com picos altos e finos, no desktop fica larga e
 * baixa — e nos dois casos ocupa a largura inteira sem sobra.
 */
export default function AreaRange({ className = 'h-6 sm:h-9', flip = false }) {
    const width = 100;
    const step = width / AREAS.length;

    return (
        <svg
            aria-hidden="true"
            focusable="false"
            viewBox={`0 0 ${width} 20`}
            preserveAspectRatio="none"
            className={`block w-full ${className} ${flip ? 'rotate-180' : ''}`}
        >
            {AREAS.map((area, index) => {
                const left = index * step;
                return (
                    <polygon
                        key={area.slug}
                        points={`${left},20 ${left + step / 2},0 ${left + step},20`}
                        fill={area.color}
                    />
                );
            })}
        </svg>
    );
}
