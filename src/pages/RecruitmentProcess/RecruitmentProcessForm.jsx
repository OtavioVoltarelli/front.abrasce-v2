import { useState } from 'react';
import { MAX_PDF_SIZE, buildFileUrl } from '../../services/fileService';

/**
 * Formulário de processo seletivo — criação e edição.
 * Igual ao NewsForm: só coleta dados e devolve no onSubmit.
 */
function RecruitmentProcessForm({ initialValues, onSubmit, onCancel, isSaving }) {
    const isEditing = Boolean(initialValues?.id);

    const [title, setTitle] = useState(initialValues?.title ?? '');
    const [isActive, setIsActive] = useState(initialValues?.active ?? true);
    const [pdfFile, setPdfFile] = useState(null);
    const [fileError, setFileError] = useState('');

    const existingPdfUrl = initialValues?.pdfUrl ?? '';

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > MAX_PDF_SIZE) {
            setFileError(
                `Arquivo muito grande. O máximo é ${MAX_PDF_SIZE / 1024 / 1024} MB.`
            );
            event.target.value = '';
            setPdfFile(null);
            return;
        }

        setFileError('');
        setPdfFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (fileError) return;
        onSubmit({ title, isActive, pdfFile });
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="rp-title">Título: </label>
                    <input
                        type="text"
                        id="rp-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="rp-pdf">Anexar Edital: </label>
                    <input
                        type="file"
                        id="rp-pdf"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required={!isEditing}
                    />
                    {isEditing && existingPdfUrl && (
                        <p>
                            <strong>Arquivo Atual:</strong>{' '}
                            <a
                                href={buildFileUrl(existingPdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {existingPdfUrl}
                            </a>
                        </p>
                    )}
                </div>

                {isEditing && (
                    /* fieldset + legend é o agrupamento correto para rádios:
                       o leitor de tela anuncia "Status" antes de cada opção. */
                    <fieldset>
                        <legend>Status</legend>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                checked={isActive === true}
                                onChange={() => setIsActive(true)}
                            />
                            Ativo
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                checked={isActive === false}
                                onChange={() => setIsActive(false)}
                            />
                            Inativo
                        </label>
                    </fieldset>
                )}

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
        </div>
    );
}

export default RecruitmentProcessForm;
