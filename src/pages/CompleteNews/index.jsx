import './style.css';
import { useParams, useLocation } from 'react-router-dom';

function CompleteNew() {
    const { title } = useParams();
    const location = useLocation();
    const { imageUrl, fullContent, pdfUrl, postDate } = location.state || {};


    const formatTitle = (rawTitle) => {
        return rawTitle
            .split('-') 
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '); 
    };

    return (
        <div id="complete-new">
            <article id='postdate'>
                <p><strong>Data de postagem: </strong>{postDate}</p>
            </article>
            <h1 id="complete-new-title">{formatTitle(title)}</h1>
            {imageUrl && <img id="complete-new-img" src={imageUrl} alt={title} />}
            <pre id="complete-new-content">
                {fullContent || "Conteúdo não disponível."}
            </pre>
            {pdfUrl && <a id='pdf-link' href={pdfUrl} target="_blank" rel="noopener noreferrer"><strong>Visualizar Anexo</strong></a>}
        </div>
    );
}

export default CompleteNew;