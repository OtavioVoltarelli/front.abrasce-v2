import './style.css';
import { Link } from 'react-router-dom';


function Guaruja() {
    return(
        <div>
            <main id='buttons'>
                <Link to={"/transparencia/guaruja/vila-julia"}><button>Vila Julia</button></Link>
                <Link to={"/transparencia/guaruja/pereque"}><button>Pereque</button></Link>
                <Link to={"/transparencia/guaruja/assistencia-social"}><button>Assistência Social</button></Link>
            </main>
        </div>
    );
}

export default Guaruja;