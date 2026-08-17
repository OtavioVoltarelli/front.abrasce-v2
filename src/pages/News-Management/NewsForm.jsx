import { useState } from 'react';
import { MAX_IMAGE_SIZE, MAX_PDF_SIZE } from '../../services/fileService';

const EMPTY = { title: '', newsPreview: '', completeNews: '' };

/**
 * Formulário de notícia — criação e edição.
 *
 * Componente "burro" de propósito: ele só coleta o que o usuário digitou e
 * entrega no onSubmit. Quem sabe enviar arquivo e falar com a API é a página.
 * Isso mantém uma responsabilidade por arquivo e deixa o formulário testável
 * sem precisar de backend.
 */
function NewsForm({ initialValues, onSubmit, onCancel, isSaving }) {
    const isEditing = Boolean(initialValues?.id);

    // Um objeto só em vez de um useState por campo (o v1 tinha 10).
    const [values, setValues] = useState({ ...EMPTY, ...initialValues });
    const [imgFile, setImgFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [fileError, setFileError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
    };

    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const limit = type === 'image' ? MAX_IMAGE_SIZE : MAX_PDF_SIZE;
        if (file.size > limit) {
            setFileError(
                `Arquivo muito grande. O máximo é ${limit / 1024 / 1024} MB.`
            );
            event.target.value = '';
            return;
        }

        setFileError('');
        if (type === 'image') setImgFile(file);
        else setPdfFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (fileError) return;
        onSubmit({ ...values, imgFile, pdfFile });
    };

    return (
        <form id="edit" onSubmit={handleSubmit}>
            <input
                className="texts"
                type="text"
                name="title"
                placeholder="Título"
                value={values.title}
                onChange={handleChange}
                required
            />
            <textarea
                className="texts"
                name="newsPreview"
                placeholder="Prévia da Notícia"
                value={values.newsPreview}
                onChange={handleChange}
                required
            />
            <textarea
                className="texts"
                name="completeNews"
                placeholder="Notícia Completa"
                value={values.completeNews}
                onChange={handleChange}
                required
            />

            <label htmlFor="news-image">Imagem (máx. 5 MB)</label>
            <input
                id="news-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
            />

            <label htmlFor="news-pdf">PDF (opcional, máx. 10 MB)</label>
            <input
                id="news-pdf"
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, 'pdf')}
            />

            {isEditing && (
                <p className="text-sm text-gray-600">
                    Deixe os campos de arquivo vazios para manter os atuais.
                </p>
            )}

            {/* role="alert" faz o leitor de tela anunciar o erro na hora */}
            {fileError && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                    {fileError}
                </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="min-h-11 rounded border border-brand px-6 text-brand disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="min-h-11 rounded bg-brand px-6 font-semibold text-white disabled:opacity-50"
                >
                    {isSaving ? 'Salvando…' : isEditing ? 'Atualizar' : 'Salvar'}
                </button>
            </div>
        </form>
    );
}

export default NewsForm;
