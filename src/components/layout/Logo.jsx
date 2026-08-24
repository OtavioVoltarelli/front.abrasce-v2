import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ORGANIZATION } from '../../content/institutional';

/**
 * Marca da ABRASCE.
 *
 * `width` e `height` explícitos no <img> não são decoração: eles dizem ao
 * navegador quanto espaço reservar ANTES de a imagem baixar. Sem eles, a
 * navbar tem altura zero por um instante e a página inteira pula quando o
 * logo chega.
 *
 * O logo NÃO leva `loading="lazy"` (o site antigo levava). Lazy adia o
 * download de imagens que estão fora da tela; o logo está no topo, sempre
 * visível — adiar só o faz aparecer mais tarde, de graça.
 */
export default function Logo({ className = '' }) {
    return (
        <Link
            to="/"
            className={`flex items-center gap-2.5 ${className}`}
            aria-label={`${ORGANIZATION.name} — ir para a página inicial`}
        >
            <img src={logo} alt="" width={132} height={92} className="h-10 w-auto sm:h-11" />
            <span className="sr-only">{ORGANIZATION.name}</span>
        </Link>
    );
}
