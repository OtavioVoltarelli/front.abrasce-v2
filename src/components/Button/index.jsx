import { Link } from "react-router-dom";
import './style.css'


function Button({text, to}) {
    return (
        <div>
            <Link to={to}>
            <button>{text}</button>
            </Link>
        </div>
    )
}

export default Button;