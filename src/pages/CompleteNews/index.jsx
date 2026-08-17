import './style.css';
import { useParams } from 'react-router-dom';
import { useNewsById } from '../../hooks/useNews';

function CompleteNew() {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useNewsById(id);

    if (isLoading) {
        return <div>Carregando notícia...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const news = data.content;

    return (
        <div id="complete-new">
            <article id='postdate'>
                <p><strong>Data de postagem: </strong>{news.creationDate}</p>
            </article>
            <h1 id="complete-new-title">{news.title}</h1>
            {news.coverImagePath && <img id="complete-new-img" src={`${import.meta.env.VITE_API_URL}/files/admin/${news.coverImagePath}`} alt={news.title} />}
            <pre id="complete-new-content">
                {news.longDescription || "Conteúdo não disponível."}
            </pre>
            {news.filesPath.map((file) => (
                <a key={file} id='pdf-link' href={`${import.meta.env.VITE_API_URL}/files/news/${file}`} target="_blank" rel="noopener noreferrer">
                    <strong>Visualizar Anexo</strong><br />
                </a>
            ))}

            {news.pdfUrl && <a id='pdf-link' href={news.pdfUrl} target="_blank" rel="noopener noreferrer"><strong>Visualizar Anexo</strong></a>}
        </div>
    );
}

export default CompleteNew;