import './style.css';
import NewsPreview from '../../components/News-Preview';
import { useEffect, useState } from 'react';
import CONFIG from '../../config';

function News() {
    const [noticias, setNoticias] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch(`${CONFIG.API_URL}news`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar as notícias.");
                }
                return response.json();
            })
            .then((data) => {
                // Inverte a ordem das notícias para exibir as mais recentes primeiro
                setNoticias(data.reverse());
            })
            .catch((error) => {
                setErro(error.message);
            });
    }, []);

    if (erro) {
        return <div>{`Erro: ${erro}`}</div>;
    }

    return (
        <div>
            <h1 id='title'>NOTÍCIAS</h1>
            {noticias.length > 0 ? (
                noticias.map((noticia) => (
                    <NewsPreview
                        key={noticia.id}
                        title={noticia.title}
                        imageUrl={`${CONFIG.API_URL}files/${noticia.imgUrl}`}
                        resume={noticia.newsPreview}
                        fullContent={noticia.completeNews}
                        pdfUrl={`${CONFIG.API_URL}files/${noticia.pdfUrl}`}
                        postDate={noticia.postDate}
                    />
                ))
            ) : (
                <p>Carregando notícias...</p>
            )}
        </div>
    );
}

export default News;
