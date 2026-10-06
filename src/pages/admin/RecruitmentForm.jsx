import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPage from '../../components/admin/AdminPage';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import MultiFileUpload from '../../components/ui/MultiFileUpload';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/feedback/ErrorState';
import Skeleton from '../../components/feedback/Skeleton';
import {
    useCreateRecruitmentProcess,
    useDeleteRecruitmentProcess,
    useRecruitmentProcessById,
    useUpdateRecruitmentProcess,
} from '../../hooks/useRecruitmentProcess';
import { scrollToFirstError } from '../../lib/scrollToError';
import { acceptFor } from '../../lib/uploadRules';

/**
 * Criar e editar um processo seletivo.
 *
 * ---------------------------------------------------------------------------
 * POR QUE UM COMPONENTE SÓ PARA AS DUAS COISAS
 * ---------------------------------------------------------------------------
 * "Criar" e "editar" mostram os mesmos campos, com as mesmas regras e a mesma
 * validação. Dois arquivos significariam corrigir cada bug duas vezes — e uma
 * hora alguém corrige só um dos dois. A rota diz qual é o caso: se existe
 * `:id`, é edição.
 *
 * Campos vindos do `RecruitmentProcessInput` do backend v2: title, description
 * e active. Não há data de abertura nem de encerramento — quem controla se as
 * inscrições estão abertas é o booleano `active`.
 */

const EMPTY_FORM = { title: '', description: '', active: true };

const FIELD_ORDER = ['title', 'description'];

export default function AdminRecruitmentForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const query = useRecruitmentProcessById(id);
    const createMutation = useCreateRecruitmentProcess();
    const updateMutation = useUpdateRecruitmentProcess();
    const deleteMutation = useDeleteRecruitmentProcess();

    if (isEditing && query.isPending) return <FormSkeleton />;

    if (isEditing && query.isError) {
        return (
            <AdminPage title="Processo seletivo">
                <ErrorState
                    title="Não foi possível carregar este processo"
                    description="Ele pode ter sido excluído por outra pessoa."
                    error={query.error}
                    onRetry={() => query.refetch()}
                />
                <div className="mt-6">
                    <Button to="/admin/processos-seletivos" variant="secondary">
                        Voltar para a lista
                    </Button>
                </div>
            </AdminPage>
        );
    }

    /* `key` faz o React DESCARTAR e recriar o formulário quando o id muda.
       Sem isso, ir de um processo para outro manteria os valores digitados no
       anterior — os campos são os mesmos, então o React reaproveitaria o
       estado. É o mesmo motivo pelo qual `key` existe em listas. */
    return (
        <RecruitmentFormFields
            key={id ?? 'novo'}
            isEditing={isEditing}
            process={query.data}
            navigate={navigate}
            createMutation={createMutation}
            updateMutation={updateMutation}
            deleteMutation={deleteMutation}
        />
    );
}

function RecruitmentFormFields({
    isEditing,
    process,
    navigate,
    createMutation,
    updateMutation,
    deleteMutation,
}) {
    const [form, setForm] = useState(
        process
            ? { title: process.title, description: process.description ?? '', active: process.active ?? true }
            : EMPTY_FORM
    );
    // `null` = "não mexi nos anexos". Um array = "esta é a nova lista".
    const [files, setFiles] = useState(null);
    const [errors, setErrors] = useState({});
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const mutation = isEditing ? updateMutation : createMutation;

    const setField = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => {
            const next = { ...previous };
            delete next[name];
            return next;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validation = {};
        if (!form.title.trim()) validation.title = 'Informe o título do processo seletivo.';
        else if (form.title.length > 255) validation.title = 'O título pode ter no máximo 255 caracteres.';
        if (!form.description.trim()) validation.description = 'Descreva a vaga, os requisitos e como se inscrever.';

        setErrors(validation);
        if (Object.keys(validation).length > 0) {
            scrollToFirstError(FIELD_ORDER, validation);
            return;
        }

        const payload = { ...form, files: files ?? undefined };

        const onSuccess = () =>
            navigate('/admin/processos-seletivos', {
                state: {
                    flash: isEditing
                        ? 'Processo seletivo atualizado.'
                        : 'Processo seletivo criado e publicado no site.',
                },
            });

        if (isEditing) {
            updateMutation.mutate({ id: process.id, payload }, { onSuccess });
        } else {
            createMutation.mutate(payload, { onSuccess });
        }
    };

    const handleDelete = () => {
        deleteMutation.mutate(process.id, {
            onSuccess: () =>
                navigate('/admin/processos-seletivos', {
                    state: { flash: `"${process.title}" foi excluído.` },
                }),
        });
    };

    return (
        <AdminPage
            title={isEditing ? 'Editar processo seletivo' : 'Criar processo seletivo'}
            description={
                isEditing
                    ? 'As alterações aparecem no site assim que você salvar.'
                    : 'O processo aparece na página "Trabalhe conosco" logo após ser criado.'
            }
        >
            <Link
                to="/admin/processos-seletivos"
                className="mb-5 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 10H5M9 5 4 10l5 5" />
                </svg>
                Todos os processos
            </Link>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {mutation.isError && (
                    <div role="alert" className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                        <p className="text-sm font-bold text-red-800">Não foi possível salvar.</p>
                        <p className="mt-1 text-sm text-red-700">
                            {mutation.error?.message ?? 'Verifique sua conexão e tente novamente.'}
                        </p>
                    </div>
                )}

                <div className="space-y-5 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-6">
                    <Input
                        id="title"
                        label="Título"
                        required
                        name="title"
                        value={form.title}
                        onChange={(event) => setField('title', event.target.value)}
                        error={errors.title}
                        maxLength={255}
                        hint="Aparece na listagem do site. Ex.: Professor de música — Escola de Artes (Jaboticabal/SP)"
                    />

                    <Textarea
                        id="description"
                        label="Descrição"
                        required
                        name="description"
                        rows={12}
                        value={form.description}
                        onChange={(event) => setField('description', event.target.value)}
                        error={errors.description}
                        hint="Requisitos, etapas e prazos. Endereços de site e e-mails viram links clicáveis sozinhos."
                    />

                    {/* Interruptor em vez de caixa de seleção: no celular o alvo
                        de toque é a linha inteira, e o estado ligado/desligado
                        é visível de longe. `role="switch"` é o que faz o leitor
                        de tela anunciar "ativado" / "desativado". */}
                    <div className="rounded-xl bg-sand p-4 ring-1 ring-inset ring-line">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={form.active}
                            onClick={() => setField('active', !form.active)}
                            className="flex w-full items-center justify-between gap-4 text-left"
                        >
                            <span>
                                <span className="block text-sm font-semibold text-ink-800">
                                    Inscrições abertas
                                </span>
                                <span className="mt-0.5 block text-xs text-muted">
                                    {form.active
                                        ? 'O processo aparece no site e aceita novas inscrições.'
                                        : 'O processo fica fora da lista pública e não aceita inscrições.'}
                                </span>
                            </span>

                            <span
                                aria-hidden="true"
                                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                                    form.active ? 'bg-brand-600' : 'bg-line'
                                }`}
                            >
                                <span
                                    className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
                                        form.active ? 'left-6' : 'left-1'
                                    }`}
                                />
                            </span>
                        </button>
                    </div>

                    <MultiFileUpload
                        label="Edital e anexos"
                        hint="PDF, Word, planilha, apresentação, imagem ou .zip. Um processo pode não ter anexo nenhum."
                        accept={acceptFor('recruitmentProcess')}
                        existingFiles={process?.attachments ?? []}
                        files={files}
                        onChange={setFiles}
                    />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" size="lg" fullWidth className="sm:w-auto" disabled={mutation.isPending}>
                        {mutation.isPending
                            ? 'Salvando…'
                            : isEditing
                                ? 'Salvar alterações'
                                : 'Criar processo seletivo'}
                    </Button>
                    <Button
                        to="/admin/processos-seletivos"
                        variant="secondary"
                        size="lg"
                        fullWidth
                        className="sm:w-auto"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>

            {/* ------------------------------------------- ZONA DE PERIGO -- */}
            {/* Excluir fica separado, no fim, atrás de uma confirmação. Três
                camadas de proteção contra o toque errado, porque esta é a única
                ação da tela que não dá para desfazer. */}
            {isEditing && (
                <section className="mt-10 rounded-2xl border border-red-200 bg-red-50/60 p-4 sm:p-6">
                    <h2 className="text-base font-bold text-red-900">Excluir este processo</h2>
                    <p className="mt-1.5 text-sm text-red-800">
                        O processo sai do site junto com os anexos. As inscrições já recebidas
                        continuam na tela de Candidatos. Esta ação não pode ser desfeita.
                    </p>

                    {deleteMutation.isError && (
                        <p role="alert" className="mt-3 text-sm font-semibold text-red-800">
                            Não foi possível excluir: {deleteMutation.error?.message}
                        </p>
                    )}

                    <Button
                        variant="danger"
                        className="mt-4"
                        fullWidth
                        onClick={() => setIsConfirmingDelete(true)}
                    >
                        Excluir processo seletivo
                    </Button>
                </section>
            )}

            <ConfirmDialog
                isOpen={isConfirmingDelete}
                onClose={() => setIsConfirmingDelete(false)}
                onConfirm={handleDelete}
                isPending={deleteMutation.isPending}
                title="Excluir processo seletivo?"
                description={`"${process?.title}" será removido do site permanentemente, junto com os anexos.`}
                confirmLabel="Sim, excluir"
            />
        </AdminPage>
    );
}

function FormSkeleton() {
    return (
        <AdminPage title="Editar processo seletivo">
            <div className="space-y-5 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-6">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </AdminPage>
    );
}
