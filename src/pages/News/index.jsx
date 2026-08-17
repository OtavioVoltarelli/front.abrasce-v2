import './style.css';
import NewsPreview from '../../components/News-Preview';
import { useNewsList } from '../../hooks/useNews';
import Loading from '../../components/Loading';

function News() {
    const {data, isLoading, isError, error} = useNewsList(5);

    if (isLoading) {
            return ( 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '80vh' }}>
                    <Loading />
                </div>
            );
        }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const noticias = data.content;

    return (
        <div>
            <h1 id='title'>NOTÍCIAS</h1>
            <p>
                {noticias.map((noticia) => (
                    <NewsPreview
                        key={noticia.id}
                        news={noticia}
                    />
                ))}
            </p>
        </div>
    );
}

export default News;
