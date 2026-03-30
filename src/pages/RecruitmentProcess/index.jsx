import './style.css';
import React, { useEffect, useState } from "react";
import CONFIG from '../../config';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function RecruitmentProcess() {
    const [dados, setDados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [title, setTitle] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [existingPdfUrl, setExistingPdfUrl] = useState("");

    const maxFileSize = 10 * 1024 * 1024;

    const navigate = useNavigate();

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return
        }
    }, [navigate, token]);

    useEffect(() => {
        fetch(`${CONFIG.API_URL}recruitment-process`)
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

    const handleEditClick = (processo) => {
        setTitle(processo.title);
        setIsActive(processo.active);
        setExistingPdfUrl(processo.pdfUrl);
        setCurrentId(processo.id);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateClick = () => {
        setTitle("");
        setPdfFile(null);
        setIsActive(true);
        setExistingPdfUrl("");
        setIsEditing(false);
        setShowForm(!showForm);
    };

    const handleTituloChange = (event) => {
        setTitle(event.target.value);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.size > maxFileSize) {
            alert('O arquivo é muito grande! O tamanho máximo permitido é 10MB.');
            setPdfFile(null);
        } else {
            setPdfFile(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title) {
            alert("Por favor, preencha o título.");
            return;
        }

        try {
            let pdfUrl = existingPdfUrl;

            if (pdfFile) {
                const fileFormData = new FormData();
                fileFormData.append("file", pdfFile);

                const fileResponse = await fetch(`${CONFIG.API_URL}files/upload`, {
                    method: "POST",
                    body: fileFormData,
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!fileResponse.ok) {
                    throw new Error("Erro ao enviar o arquivo PDF.");
                }

                pdfUrl = await fileResponse.text();
            }

            const requestBody = { title, isActive };
            if (pdfUrl) {
                requestBody.pdfUrl = pdfUrl;
            }

            const processResponse = await fetch(
                isEditing
                    ? `${CONFIG.API_URL}recruitment-process/${currentId}`
                    : `${CONFIG.API_URL}recruitment-process`,
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!processResponse.ok) {
                throw new Error(isEditing ? "Erro ao editar o processo seletivo." : "Erro ao criar o processo seletivo.");
            }

            alert(isEditing ? "Processo seletivo atualizado com sucesso!" : "Processo seletivo criado com sucesso!");

            setTitle("");
            setPdfFile(null);
            setIsActive(true);
            setExistingPdfUrl("");
            setShowForm(false);

            const updatedResponse = await fetch(`${CONFIG.API_URL}recruitment-process`);
            const updatedData = await updatedResponse.json();
            setDados(updatedData.reverse());
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este processo seletivo?");
        if (!confirmDelete) return;

        try {
            const deleteResponse = await fetch(`${CONFIG.API_URL}recruitment-process/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!deleteResponse.ok) {
                throw new Error("Erro ao excluir o processo seletivo.");
            }

            const updatedResponse = await fetch(`${CONFIG.API_URL}recruitment-process`);
            const updatedData = await updatedResponse.json();
            setDados(updatedData);

            alert("Processo seletivo excluído com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    if (carregando) return <div>Carregando...</div>;

    return (
        <main id="rp">
            <article id='title'>
                <h1>Processos Seletivos</h1>
            </article>
            <button id='create' onClick={handleCreateClick}>
                {showForm ? "Cancelar" : "Criar novo processo seletivo"}
            </button>

            {showForm && (
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title">Título: </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={handleTituloChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="pdfFile">Anexar Edital: </label>
                            <input
                                type="file"
                                id="pdfFile"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                required={!isEditing}
                            />
                            {isEditing && existingPdfUrl && (
                                <p>
                                    <strong>Arquivo Atual:</strong>{" "}
                                    <a href={`${CONFIG.API_URL}files/${existingPdfUrl}`} target="_blank" rel="noopener noreferrer">
                                        {existingPdfUrl}
                                    </a>
                                </p>
                            )}
                        </div>
                        {isEditing && (
                            <div>
                                <label>Status: </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="true"
                                        checked={isActive === true}
                                        onChange={() => setIsActive(true)}
                                    />
                                    Ativo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="false"
                                        checked={isActive === false}
                                        onChange={() => setIsActive(false)}
                                    />
                                    Inativo
                                </label>
                            </div>
                        )}
                        <button type="submit">{isEditing ? "Atualizar" : "Salvar"}</button>
                    </form>
                </div>
            )}

            {!erro && dados.length > 0 ? (
                dados.map((processo) => (
                    <article className="process" key={processo.id}>
                        <p><strong>ID:</strong> {processo.id}</p>
                        <p><strong>Título:</strong> {processo.title}</p>
                        <p>
                            <strong>PDF:</strong>{" "}
                            <a href={`${CONFIG.API_URL}files/${processo.pdfUrl}`} target="_blank" rel="noopener noreferrer">
                                {processo.pdfUrl}
                            </a>
                        </p>
                        <p><strong>Data de Criação:</strong> {processo.creationDate}</p>
                        <p><strong>Status:</strong> {processo.active ? "Ativo" : "Inativo"}</p>
                        <section id='edit-and-delete'>
                            <button id='edit' onClick={() => handleEditClick(processo)}>Editar</button>
                            <button id='delete' onClick={() => handleDelete(processo.id)}>Excluir</button>
                        </section>
                    </article>
                ))
            ) : (
                !erro && <p>Nenhum processo seletivo encontrado.</p>
            )}

            {erro && <div>Erro: {erro}</div>}
        </main>
    );
}

export default RecruitmentProcess;