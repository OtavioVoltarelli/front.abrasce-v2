import './style.css';
import { useState } from 'react';
import Loading from '../../components/Loading';
import AlertModal from '../../components/AlertModal';
import NewsForm from './NewsForm';
import {
    useAllNews,
    useCreateNews,
    useUpdateNews,
    useDeleteNews,
} from '../../hooks/useNews';
import { uploadFile, buildFileUrl, buildNewsPdfUrl } from '../../services/fileService';

function NewsManagement() {
    /* Dados e escritas — tudo vindo dos hooks. A página não conhece axios,
       não guarda lista em useState e não refaz busca na mão: quando uma
       mutation termina, ela invalida o cache e o React Query rebusca. */
    const { data: news = [], isPending, isError, error } = useAllNews();
    const createNews = useCreateNews();
    const updateNews = useUpdateNews();
    const deleteNews = useDeleteNews();

    /* Estado só de interface. */
    const [editingNews, setEditingNews] = useState(null); // null = form fechado
    const [pendingDelete, setPendingDelete] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const isFormOpen = editingNews !== null;
    const isSaving = createNews.isPending || updateNews.isPending;

    const openCreateForm = () => setEditingNews({});
    const closeForm = () => setEditingNews(null);

    const openEditForm = (item) => {
        setEditingNews(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async ({ title, newsPreview, completeNews, imgFile, pdfFile }) => {
        try {
            /* Só sobe arquivo novo; sem arquivo, mantém a URL que já existia.
               Os dois uploads são independentes, então vão em paralelo. */
            const [imgUrl, pdfUrl] = await Promise.all([
                imgFile ? uploadFile(imgFile) : editingNews.imgUrl ?? '',
                pdfFile ? uploadFile(pdfFile, 'news-pdfs') : editingNews.pdfUrl ?? '',
            ]);

            const payload = { title, newsPreview, completeNews, imgUrl, pdfUrl };

            if (editingNews.id) {
                await updateNews.mutateAsync({ id: editingNews.id, payload });
            } else {
                await createNews.mutateAsync(payload);
            }

            closeForm();
            setFeedback({
                title: 'Tudo certo',
                message: editingNews.id
                    ? 'Notícia atualizada com sucesso.'
                    : 'Notícia criada com sucesso.',
            });
        } catch (err) {
            setFeedback({
                title: 'Não foi possível salvar',
                message: err?.response?.data?.message ?? err.message,
            });
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteNews.mutateAsync(pendingDelete.id);
            setPendingDelete(null);
            setFeedback({ title: 'Tudo certo', message: 'Notícia excluída com sucesso.' });
        } catch (err) {
            setPendingDelete(null);
            setFeedback({
                title: 'Não foi possível excluir',
                message: err?.response?.data?.message ?? err.message,
            });
        }
    };

    if (isPending) return <Loading />;

    return (
        <main id="news-management">
            <article id="title">
                <h1>Notícias</h1>
            </article>

            <button
                id="create-new"
                onClick={isFormOpen ? closeForm : openCreateForm}
            >
                {isFormOpen ? 'Cancelar' : 'Criar nova notícia'}
            </button>

            {isFormOpen && (
                /* key força o React a recriar o formulário ao trocar de item.
                   Sem isso ele reaproveitaria a instância e manteria o texto
                   da notícia anterior nos campos. */
                <NewsForm
                    key={editingNews.id ?? 'new'}
                    initialValues={editingNews}
                    onSubmit={handleSave}
                    onCancel={closeForm}
                    isSaving={isSaving}
                />
            )}

            {isError && (
                <p role="alert" className="font-semibold text-red-600">
                    Erro ao carregar as notícias: {error.message}
                </p>
            )}

            {!isError && news.length === 0 && <p>Nenhuma notícia encontrada.</p>}

            {news.map((item) => (
                <article className="news" key={item.id}>
                    <section className="infos">
                        <p><strong>Título: </strong>{item.title}</p>
                        <p><strong>Data: </strong>{item.data}</p>
                        {item.imgUrl && (
                            <img src={buildFileUrl(item.imgUrl)} alt={item.title} loading="lazy" />
                        )}
                        <p><strong>Resumo: </strong>{item.newsPreview}</p>
                        <p><strong>Completo: </strong>{item.completeNews}</p>
                        {item.pdfUrl && (
                            <a
                                href={buildNewsPdfUrl(item.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <strong>Visualizar PDF</strong>
                            </a>
                        )}
                    </section>
                    <section className="edit-and-delete">
                        <button className="edit" onClick={() => openEditForm(item)}>
                            Editar
                        </button>
                        <button className="delete" onClick={() => setPendingDelete(item)}>
                            Excluir
                        </button>
                    </section>
                </article>
            ))}

            <AlertModal
                isOpen={pendingDelete !== null}
                title="Excluir notícia"
                message={`Tem certeza que deseja excluir "${pendingDelete?.title}"? Esta ação não pode ser desfeita.`}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleConfirmDelete}
                confirmLabel="Excluir"
                isConfirming={deleteNews.isPending}
            />

            <AlertModal
                isOpen={feedback !== null}
                title={feedback?.title}
                message={feedback?.message}
                onClose={() => setFeedback(null)}
            />
        </main>
    );
}

export default NewsManagement;
