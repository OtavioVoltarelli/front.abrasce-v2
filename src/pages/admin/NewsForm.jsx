import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminPage from '../../components/admin/AdminPage';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import MediaField from '../../components/media/MediaField';
import MultiFileUpload from '../../components/ui/MultiFileUpload';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ErrorState from '../../components/feedback/ErrorState';
import Skeleton from '../../components/feedback/Skeleton';
import {
    useCreateNews,
    useDeleteNews,
    useNewsById,
    useUpdateNews,
} from '../../hooks/useNews';

/**
 * Criar e editar uma notícia.
 *
 * Campos vindos do `NewsInput` do backend v2:
 *   title            (obrigatório, máx. 255)
 *   shortDescription (obrigatório, máx. 255) — é a chamada da listagem
 *   longDescription  (obrigatório)           — o texto da notícia
 *   coverImageId     (obrigatório) — id de um arquivo da BIBLIOTECA
 * Mais os anexos, que vão na parte "files" do multipart.
 *
 * ---------------------------------------------------------------------------
 * A CAPA NÃO É MAIS UM UPLOAD
 * ---------------------------------------------------------------------------
 * Antes este formulário subia uma imagem junto com a notícia. Agora ele ESCOLHE
 * uma imagem que já está na biblioteca de arquivos reutilizáveis, porque foi
 * isso que o backend passou a exigir: `News.coverImage` é chave estrangeira
 * para `ReusableFile`.
 *
 * Isso resolve um problema que o upload direto tinha e que só aparecia com o
 * tempo: a mesma foto de campanha subia de novo a cada notícia, virando cinco
 * arquivos iguais no servidor e cinco lugares para corrigir quando a imagem
 * mudasse. Com a biblioteca, a foto sobe uma vez e cinco notícias apontam para
 * ela — e trocá-la troca as cinco de uma vez.
 *
 * Criar e editar usam o MESMO componente (`MediaField`) e o MESMO seletor. A
 * única diferença é que, ao editar, o campo já vem preenchido com a capa atual.
 *
 * O contador de caracteres nos dois campos limitados a 255 existe porque o
 * limite é do BANCO: passar dele não dá erro de digitação, dá erro 400 ao
 * salvar, depois de a pessoa ter escrito tudo. Mostrar quanto falta evita
 * descobrir o problema no fim.
 */

const EMPTY_FORM = { title: '', shortDescription: '', longDescription: '' };
const MAX_SHORT = 255;

export default function AdminNewsForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const query = useNewsById(id);
    const createMutation = useCreateNews();
    const updateMutation = useUpdateNews();
    const deleteMutation = useDeleteNews();

    if (isEditing && query.isPending) return <FormSkeleton />;

    if (isEditing && query.isError) {
        return (
            <AdminPage title="Notícia">
                <ErrorState
                    title="Não foi possível carregar esta notícia"
                    description="Ela pode ter sido excluída por outra pessoa."
                    error={query.error}
                    onRetry={() => query.refetch()}
                />
                <div className="mt-6">
                    <Button to="/admin/noticias" variant="secondary">
                        Voltar para a lista
                    </Button>
                </div>
            </AdminPage>
        );
    }

    // `key`: ao trocar de notícia, o React recria o formulário em vez de
    // reaproveitar o estado com os valores da anterior.
    return (
        <NewsFormFields
            key={id ?? 'nova'}
            isEditing={isEditing}
            news={query.data}
            navigate={navigate}
            createMutation={createMutation}
            updateMutation={updateMutation}
            deleteMutation={deleteMutation}
        />
    );
}

function NewsFormFields({ isEditing, news, navigate, createMutation, updateMutation, deleteMutation }) {
    const [form, setForm] = useState(
        news
            ? {
                title: news.title,
                shortDescription: news.shortDescription ?? '',
                longDescription: news.longDescription ?? '',
            }
            : EMPTY_FORM
    );
    /* Guarda o OBJETO do arquivo, não só o id: o campo precisa do nome e do
       `storedName` para desenhar a pré-visualização. Na hora de salvar,
       manda só o id, que é o que o backend espera. */
    const [coverImage, setCoverImage] = useState(news?.coverImage ?? null);
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
        if (!form.title.trim()) validation.title = 'Informe o título da notícia.';
        else if (form.title.length > 255) validation.title = 'O título pode ter no máximo 255 caracteres.';

        if (!form.shortDescription.trim()) {
            validation.shortDescription = 'Escreva a chamada que aparece na listagem.';
        } else if (form.shortDescription.length > MAX_SHORT) {
            validation.shortDescription = `A chamada pode ter no máximo ${MAX_SHORT} caracteres.`;
        }

        if (!form.longDescription.trim()) validation.longDescription = 'Escreva o texto da notícia.';

        /* Obrigatória nos DOIS casos, e não só ao criar. Antes, editar sem
           mexer na capa mandava o campo vazio e o service entendia "mantenha a
           atual". Isso deixou de ser possível — e de ser necessário: como o
           campo já vem preenchido com a capa atual, "vazio" agora só acontece
           se a pessoa remover de propósito, e aí é erro mesmo.
           O backend concorda: `coverImageId` é `@NotNull`. */
        if (!coverImage) validation.coverImage = 'Escolha a imagem de capa na biblioteca.';

        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        const payload = {
            ...form,
            coverImageId: coverImage.id,
            files: files ?? undefined,
        };

        const onSuccess = () =>
            navigate('/admin/noticias', {
                state: {
                    flash: isEditing ? 'Notícia atualizada.' : 'Notícia publicada no site.',
                },
            });

        if (isEditing) {
            updateMutation.mutate({ id: news.id, payload }, { onSuccess });
        } else {
            createMutation.mutate(payload, { onSuccess });
        }
    };

    const handleDelete = () => {
        deleteMutation.mutate(news.id, {
            onSuccess: () =>
                navigate('/admin/noticias', { state: { flash: `"${news.title}" foi excluída.` } }),
        });
    };

    const shortRemaining = MAX_SHORT - form.shortDescription.length;

    return (
        <AdminPage
            title={isEditing ? 'Editar notícia' : 'Criar notícia'}
            description={
                isEditing
                    ? 'As alterações aparecem no site assim que você salvar.'
                    : 'A notícia aparece na home e na página de notícias logo após ser publicada.'
            }
        >
            <Link
                to="/admin/noticias"
                className="mb-5 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-coral-ink hover:brightness-90"
            >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 10H5M9 5 4 10l5 5" />
                </svg>
                Todas as notícias
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
                    <MediaField
                        label="Imagem de capa"
                        required
                        kind="image"
                        hint="Aparece no card da listagem e no topo da notícia. Escolha da biblioteca de arquivos reutilizáveis."
                        pickerTitle="Escolher a imagem de capa"
                        value={coverImage}
                        onChange={(file) => {
                            setCoverImage(file);
                            setErrors((previous) => {
                                const next = { ...previous };
                                delete next.coverImage;
                                return next;
                            });
                        }}
                        error={errors.coverImage}
                    />

                    <Input
                        label="Título"
                        required
                        name="title"
                        value={form.title}
                        onChange={(event) => setField('title', event.target.value)}
                        error={errors.title}
                        maxLength={255}
                    />

                    <Textarea
                        label="Chamada"
                        required
                        name="shortDescription"
                        rows={3}
                        value={form.shortDescription}
                        onChange={(event) => setField('shortDescription', event.target.value)}
                        error={errors.shortDescription}
                        maxLength={MAX_SHORT}
                        hint="Uma ou duas frases. É o texto que aparece embaixo do título na listagem."
                    />
                    {/* O contador vira alerta nos últimos 40 caracteres, e a
                        mudança não é só de cor: o texto muda junto, porque cor
                        sozinha não comunica nada para quem não a distingue. */}
                    <p
                        className={`-mt-3 text-xs ${shortRemaining <= 40 ? 'font-semibold text-amber-700' : 'text-muted'}`}
                        aria-live="polite"
                    >
                        {shortRemaining <= 40
                            ? `Restam ${shortRemaining} caracteres`
                            : `${form.shortDescription.length} de ${MAX_SHORT} caracteres`}
                    </p>

                    <Textarea
                        label="Texto da notícia"
                        required
                        name="longDescription"
                        rows={14}
                        value={form.longDescription}
                        onChange={(event) => setField('longDescription', event.target.value)}
                        error={errors.longDescription}
                        hint="Deixe uma linha em branco entre os parágrafos. Endereços de site e e-mails viram links clicáveis sozinhos — basta escrevê-los por extenso (https://… ou www.…)."
                    />

                    <MultiFileUpload
                        label="Anexos"
                        hint="PDF ou Word. Uma notícia pode não ter anexo nenhum."
                        existingFiles={news?.filesPath ?? []}
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
                                : 'Publicar notícia'}
                    </Button>
                    <Button to="/admin/noticias" variant="secondary" size="lg" fullWidth className="sm:w-auto">
                        Cancelar
                    </Button>
                </div>
            </form>

            {isEditing && (
                <section className="mt-10 rounded-2xl border border-red-200 bg-red-50/60 p-4 sm:p-6">
                    <h2 className="text-base font-bold text-red-900">Excluir esta notícia</h2>
                    <p className="mt-1.5 text-sm text-red-800">
                        A notícia sai do site junto com a imagem de capa e os anexos. Esta ação não
                        pode ser desfeita.
                    </p>

                    {deleteMutation.isError && (
                        <p role="alert" className="mt-3 text-sm font-semibold text-red-800">
                            Não foi possível excluir: {deleteMutation.error?.message}
                        </p>
                    )}

                    <Button variant="danger" className="mt-4" fullWidth onClick={() => setIsConfirmingDelete(true)}>
                        Excluir notícia
                    </Button>
                </section>
            )}

            <ConfirmDialog
                isOpen={isConfirmingDelete}
                onClose={() => setIsConfirmingDelete(false)}
                onConfirm={handleDelete}
                isPending={deleteMutation.isPending}
                title="Excluir notícia?"
                description={`"${news?.title}" será removida do site permanentemente.`}
                confirmLabel="Sim, excluir"
            />
        </AdminPage>
    );
}

function FormSkeleton() {
    return (
        <AdminPage title="Editar notícia">
            <div className="space-y-5 rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-6">
                <Skeleton className="aspect-[16/9] w-full rounded-xl" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-56 w-full" />
            </div>
        </AdminPage>
    );
}
