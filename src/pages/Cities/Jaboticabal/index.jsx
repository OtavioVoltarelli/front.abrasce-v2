import './style.css';
import { Link } from 'react-router-dom';


function Jaboticabal() {
    return(
        <div>
            <main id='buttons'>
                <Link to={"/transparencia/jaboticabal/festa-do-quitute"}><button>Festa do Quitute</button></Link>
                <Link to={"/transparencia/jaboticabal/escola-da-arte"}><button>Escola da Arte</button></Link>
                <Link to={"/transparencia/jaboticabal/jabotifolia"}><button>JabotiFolia</button></Link>
            </main>
        </div>
    );
}

export default Jaboticabal;