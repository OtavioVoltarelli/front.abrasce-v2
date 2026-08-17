import { useNavigate } from "react-router-dom"

function JobsPreview({ process }) {
    const navigate = useNavigate();

    return (
        <div>
            <h3>{process.title}</h3>
            <p>{process.description}</p>
            <button onClick={() => navigate(`/processo-seletivo/${process.id}`)}>Ver detalhes</button>
        </div>
    )
    
}



export default JobsPreview