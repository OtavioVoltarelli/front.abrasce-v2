import './style.css';
import { useNavigate } from 'react-router-dom';

function NewsPreview({news}) {
    const navigate = useNavigate();

    const { title, coverImagePath, shortDescription, creationDate } = news;

    return (
        <div id="news-preview">
            <article id='postdate'>
                <p><strong>Data de postagem: </strong>{creationDate}</p>
            </article>
            <h2 id="news-title">{title}</h2>
            <img id="news-img" src={`${import.meta.env.VITE_API_URL}/files/admin/${coverImagePath}`} alt="Notícia" />
            <p id="news-resume">{shortDescription}</p>
            <button className="read-more" onClick={() => navigate(`/noticias/${news.id}`)}>
                Ler mais
            </button>
        </div>
    );
}

export default NewsPreview;