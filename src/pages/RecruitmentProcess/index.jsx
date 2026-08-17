import './style.css';
import { useState } from 'react';
import Loading from '../../components/Loading';
import AlertModal from '../../components/AlertModal';
import RecruitmentProcessForm from './RecruitmentProcessForm';
import {
    useAllRecruitmentProcesses,
    useCreateRecruitmentProcess,
    useUpdateRecruitmentProcess,
    useDeleteRecruitmentProcess,
} from '../../hooks/useRecruitmentProcess';
import { uploadFile, buildFileUrl } from '../../services/fileService';

function RecruitmentProcess() {
    const { data: processes = [], isPending, isError, error } = useAllRecruitmentProcesses();
    const createProcess = useCreateRecruitmentProcess();
    const updateProcess = useUpdateRecruitmentProcess();
    const deleteProcess = useDeleteRecruitmentProcess();

    const [editingProcess, setEditingProcess] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const isFormOpen = editingProcess !== null;
    const isSaving = createProcess.isPending || updateProcess.isPending;

    const openCreateForm = () => setEditingProcess({});
    const closeForm = () => setEditingProcess(null);

    const openEditForm = (item) => {
        setEditingProcess(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async ({ title, isActive, pdfFile }) => {
        try {
            const pdfUrl = pdfFile
                ? await uploadFile(pdfFile)
                : editingProcess.pdfUrl ?? '';

            const payload = { title, isActive };
            if (pdfUrl) payload.pdfUrl = pdfUrl;

            if (editingProcess.id) {
                await updateProcess.mutateAsync({ id: editingProcess.id, payload });
            } else {
                await createProcess.mutateAsync(payload);
            }

            closeForm();
            setFeedback({
                title: 'Tudo certo',
                message: editingProcess.id
                    ? 'Processo seletivo atualizado com sucesso.'
                    : 'Processo seletivo criado com sucesso.',
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
            await deleteProcess.mutateAsync(pendingDelete.id);
            setPendingDelete(null);
            setFeedback({
                title: 'Tudo certo',
                message: 'Processo seletivo excluído com sucesso.',
            });
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
        <main id="rp">
            <article id="title">
                <h1>Processos Seletivos</h1>
            </article>

            <button id="create" onClick={isFormOpen ? closeForm : openCreateForm}>
                {isFormOpen ? 'Cancelar' : 'Criar novo processo seletivo'}
            </button>

            {isFormOpen && (
                <RecruitmentProcessForm
                    key={editingProcess.id ?? 'new'}
                    initialValues={editingProcess}
                    onSubmit={handleSave}
                    onCancel={closeForm}
                    isSaving={isSaving}
                />
            )}

            {isError && (
                <p role="alert" className="font-semibold text-red-600">
                    Erro ao carregar os processos seletivos: {error.message}
                </p>
            )}

            {!isError && processes.length === 0 && (
                <p>Nenhum processo seletivo encontrado.</p>
            )}

            {processes.map((item) => (
                <article className="process" key={item.id}>
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Título:</strong> {item.title}</p>
                    {item.pdfUrl && (
                        <p>
                            <strong>PDF:</strong>{' '}
                            <a
                                href={buildFileUrl(item.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.pdfUrl}
                            </a>
                        </p>
                    )}
                    <p><strong>Data de Criação:</strong> {item.creationDate}</p>
                    <p><strong>Status:</strong> {item.active ? 'Ativo' : 'Inativo'}</p>
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
                title="Excluir processo seletivo"
                message={`Tem certeza que deseja excluir "${pendingDelete?.title}"? Esta ação não pode ser desfeita.`}
                onClose={() => setPendingDelete(null)}
                onConfirm={handleConfirmDelete}
                confirmLabel="Excluir"
                isConfirming={deleteProcess.isPending}
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

export default RecruitmentProcess;
