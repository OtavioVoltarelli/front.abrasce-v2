/**
 * O triângulo do logo da ABRASCE, reduzido a um sinal gráfico.
 *
 * É o elemento de assinatura do site: aparece antes de cada título de seção,
 * sempre no mesmo tamanho e posição. A ideia é que a marca da instituição
 * seja o que organiza a página, em vez de um enfeite genérico qualquer.
 *
 * `aria-hidden` porque é decoração pura: um leitor de tela anunciando
 * "imagem, triângulo" antes de cada título só atrapalharia.
 */
export default function TriangleMark({ className = '', color = 'currentColor' }) {
    return (
        <svg viewBox="0 0 24 21" aria-hidden="true" focusable="false" className={className}>
            <path d="M12 0 24 21H0z" fill={color} />
        </svg>
    );
}
