import './style.css';
import { useNavigate } from 'react-router-dom';

function NewsPreview({ title, resume, imageUrl, fullContent, pdfUrl, postDate }) {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, '-');
    const navigate = useNavigate();

    const handleReadMore = () => {
        navigate(`/noticias/${encodeURIComponent(formattedTitle)}`, {
            state: { 
                imageUrl: imageUrl,
                fullContent: fullContent,
                pdfUrl: pdfUrl, 
                postDate: postDate,
            },
        });
    };

    return (
        <div id="news-preview">
            <article id='postdate'>
                <p><strong>Data de postagem: </strong>{postDate}</p>
            </article>
            <h2 id="news-title">{title}</h2>
            <img id="news-img" src={imageUrl} alt="Notícia" />
            <p id="news-resume">{resume}</p>
            <button className="read-more" onClick={handleReadMore}>
                Ler mais
            </button>
        </div>
    );
}

export default NewsPreview;