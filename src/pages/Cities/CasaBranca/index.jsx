import './style.css';
import { Link } from 'react-router-dom';


function CasaBranca() {
    return(
        <div>
            <main id='buttons'>
                <Link to="/transparencia/casa-branca-ri"><button>Residência Inclusiva</button></Link>
                <Link to={"/transparencia/casa-branca-paie"}><button>PAIE</button></Link>
                <Link to={"/transparencia/casa-branca-cese"}><button>CESE</button></Link>
            </main>
        </div>
    );
}

export default CasaBranca;