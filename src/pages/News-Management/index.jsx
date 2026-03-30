import './style.css';
import React, { useEffect, useState } from "react";
import CONFIG from '../../config';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function NewsManagement() {
    const [dados, setDados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [title, setTitle] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [imgUrl, setImgUrl] = useState("");
    const [newsPreview, setNewsPreview] = useState("");
    const [completeNews, setCompleteNews] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");

    const maxFileSize = 5 * 1024 * 1024;

    const navigate = useNavigate();

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return
        }
    }, [navigate, token]);


    useEffect(() => {
        fetch(`${CONFIG.API_URL}news`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar os dados'); 
                }
                return response.json();
            })
            .then(data => {
                setDados(data.reverse());
                setCarregando(false);
            })
            .catch(error => {
                setErro(error.message);
                setCarregando(false);
            });
    }, []);

    const handleEditClick = (noticia) => {
        setTitle(noticia.title);
        setNewsPreview(noticia.newsPreview);
        setCompleteNews(noticia.completeNews);
        setImgUrl(noticia.imgUrl);
        setPdfUrl(noticia.pdfUrl || "");
        setCurrentId(noticia.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateClick = () => {
        setTitle("");
        setImgFile(null);
        setImgUrl("");
        setNewsPreview("");
        setCompleteNews("");
        setPdfFile(null);
        setPdfUrl("");
        setIsEditing(false);
        setShowForm(!showForm);
    };

    const handleFileChange = (event, type) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.size > maxFileSize) {
            alert('O arquivo é muito grande! O tamanho máximo permitido é 5MB.');
            if (type === "image") setImgFile(null);
            else setPdfFile(null);
            return;
        }

        if (type === "image") setImgFile(selectedFile);
        else setPdfFile(selectedFile);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title || !newsPreview || !completeNews) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            let imageUrl = imgUrl;
            let uploadedPdfUrl = pdfUrl;

            if (imgFile) {
                const fileFormData = new FormData();
                fileFormData.append("file", imgFile);

                const fileResponse = await fetch(`${CONFIG.API_URL}files/upload`, {
                    method: "POST",
                    body: fileFormData,
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!fileResponse.ok) {
                    throw new Error("Erro ao enviar a imagem.");
                }

                imageUrl = await fileResponse.text();
            }

            if (pdfFile) {
                const pdfFormData = new FormData();
                pdfFormData.append("file", pdfFile);

                const pdfResponse = await fetch(`${CONFIG.API_URL}files/upload?directory=news-pdfs`, {
                    method: "POST",
                    body: pdfFormData,
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!pdfResponse.ok) {
                    throw new Error("Erro ao enviar o PDF.");
                }

                uploadedPdfUrl = await pdfResponse.text();
            }

            const requestBody = { title, imgUrl: imageUrl, newsPreview, completeNews, pdfUrl: uploadedPdfUrl };

            const newsResponse = await fetch(
                isEditing
                    ? `${CONFIG.API_URL}news/${currentId}`
                    : `${CONFIG.API_URL}news`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
                    body: JSON.stringify(requestBody),
                }
            );

            if (!newsResponse.ok) {
                throw new Error(isEditing ? "Erro ao editar a notícia." : "Erro ao criar a notícia.");
            }

            alert(isEditing ? "Notícia atualizada com sucesso!" : "Notícia criada com sucesso!");

            setTitle("");
            setImgFile(null);
            setImgUrl("");
            setNewsPreview("");
            setCompleteNews("");
            setPdfFile(null);
            setPdfUrl("");
            setShowForm(false);

            const updatedResponse = await fetch(`${CONFIG.API_URL}news`);
            const updatedData = await updatedResponse.json();
            setDados(updatedData.reverse());
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta notícia?");
        if (!confirmDelete) return;

        try {
            const deleteResponse = await fetch(`${CONFIG.API_URL}news/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!deleteResponse.ok) {
                throw new Error("Erro ao excluir a notícia.");
            }

            const updatedResponse = await fetch(`${CONFIG.API_URL}news`);
            const updatedData = await updatedResponse.json();
            setDados(updatedData.reverse());

            alert("Notícia excluída com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    if (carregando) return <div>Carregando...</div>;

    return (
        <main id="news-management">
            <article id='title'>
                <h1>Notícias</h1>
            </article>
            <button id='create-new' onClick={handleCreateClick}>{showForm ? "Cancelar" : "Criar nova notícia"}</button>

            {showForm && (
                <form id='edit' onSubmit={handleSubmit}>
                    <input className='texts' type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea className='texts' placeholder="Prévia da Notícia" value={newsPreview} onChange={(e) => setNewsPreview(e.target.value)} required />
                    <textarea className='texts' placeholder="Notícia Completa" value={completeNews} onChange={(e) => setCompleteNews(e.target.value)} required />
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
                    <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, "pdf")} />
                    <button type="submit">{isEditing ? "Atualizar" : "Salvar"}</button>
                </form>
            )}

            {!erro && dados.length > 0 ? (
                dados.map((noticia) => (
                    <article id='news' key={noticia.id}>
                        <section id='infos'>
                            <p><strong>Título: </strong>{noticia.title}</p>
                            <p><strong>Data: </strong>{noticia.data}</p>
                            {noticia.imgUrl && <img src={`${CONFIG.API_URL}files/${noticia.imgUrl}`} alt={noticia.title} />}
                            <p><strong>Resumo: </strong>{noticia.newsPreview}</p>
                            <p><strong>Completo: </strong>{noticia.completeNews}</p>
                            {noticia.pdfUrl && <a href={`${CONFIG.API_URL}files/documents${noticia.pdfUrl}`} target="_blank" rel="noopener noreferrer"><strong>Visualizar PDF</strong></a>}
                        </section>
                        <section id='edit-and-delete'>
                            <button id='edit' onClick={() => handleEditClick(noticia)}>Editar</button>
                            <button id='delete' onClick={() => handleDelete(noticia.id)}>Excluir</button>
                        </section>
                    </article>
                ))
            ) : (
                !erro && <p>Nenhuma notícia encontrada.</p>
            )}

            {erro && <div>Erro: {erro}</div>}
        </main>
    );
}

export default NewsManagement;