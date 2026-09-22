import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import FileUpload from '../ui/FileUpload';
import { useCreateTransparencyFolder, useUploadTransparencyFile } from '../../hooks/useTransparency';

/* Mesma allowlist de extensão que o backend aceita (`file.allowed-extensions`,
   application.properties) — vale para todo upload do sistema, não só este. */
const ACCEPT =
    '.pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip';

/**
 * "Novo": pasta ou arquivo, dentro da pasta que a pessoa está vendo agora.
 *
 * Dois painéis dentro do MESMO modal (`panel`), não dois modais — igual ao
 * `MediaPicker`. Um segundo modal por cima do primeiro empilha duas
 * armadilhas de foco e, no celular, some com o contexto de "eu vim daqui
 * pra enviar um arquivo".
 */
export default function TransparencyCreateModal({ isOpen, onClose, folderId, existingNames }) {
    const [panel, setPanel] = useState('choose');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(null);
    const [file, setFile] = useState(null);

    const createFolder = useCreateTransparencyFolder();
    const upload = useUploadTransparencyFile();

    const close = () => {
        setPanel('choose');
        setName('');
        setNameError(null);
        setFile(null);
        createFolder.reset();
        upload.reset();
        onClose();
    };

    const collides = (candidateName) =>
        existingNames.some((existing) => existing.toLowerCase() === candidateName.toLowerCase());

    const handleCreateFolder = (event) => {
        event.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setNameError('Digite um nome para a pasta.');
            return;
        }
        if (collides(trimmed)) {
            setNameError('Já existe um item com este nome aqui.');
            return;
        }
        setNameError(null);
        createFolder.mutate(folderId ? `${folderId}/${trimmed}` : trimmed, { onSuccess: close });
    };

    const handleUpload = () => {
        if (!file) return;
        upload.mutate({ file, path: folderId ?? '' }, { onSuccess: close });
    };

    const fileCollides = file ? collides(file.name) : false;

    if (panel === 'folder') {
        return (
            <Modal isOpen={isOpen} onClose={close} title="Nova pasta" size="sm">
                <form onSubmit={handleCreateFolder} noValidate className="space-y-4">
                    <Input
                        label="Nome da pasta"
                        autoFocus
                        value={name}
                        onChange={(event) => { setName(event.target.value); setNameError(null); }}
                        error={nameError}
                        maxLength={120}
                    />
                    {createFolder.isError && (
                        <p role="alert" className="text-sm font-semibold text-berry-ink">
                            {createFolder.error?.message}
                        </p>
                    )}
                    <Button type="submit" fullWidth disabled={createFolder.isPending}>
                        {createFolder.isPending ? 'Criando…' : 'Criar pasta'}
                    </Button>
                </form>
            </Modal>
        );
    }

    if (panel === 'upload') {
        return (
            <Modal isOpen={isOpen} onClose={close} title="Enviar arquivo" size="sm">
                <div className="space-y-4">
                    <FileUpload
                        label="Arquivo"
                        accept={ACCEPT}
                        maxSizeMb={15}
                        value={file}
                        onChange={setFile}
                        error={fileCollides ? 'Já existe um arquivo com este nome aqui — enviar vai substituí-lo.' : null}
                    />
                    {upload.isError && (
                        <p role="alert" className="text-sm font-semibold text-berry-ink">
                            {upload.error?.message}
                        </p>
                    )}
                    <Button fullWidth onClick={handleUpload} disabled={!file || upload.isPending}>
                        {upload.isPending ? 'Enviando…' : fileCollides ? 'Enviar e substituir' : 'Enviar arquivo'}
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={close} title="O que você quer adicionar?" size="sm">
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => setPanel('folder')}
                    className="flex min-h-16 w-full items-center gap-4 rounded-xl px-4 text-left ring-1 ring-line transition-colors hover:bg-sand"
                >
                    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-lg bg-sun-tint text-sun-ink">
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4L10.5 8h9a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                        </svg>
                    </span>
                    <span>
                        <span className="block text-sm font-bold text-ink-900">Nova pasta</span>
                        <span className="block text-xs text-muted">Organizar os documentos por assunto ou ano</span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setPanel('upload')}
                    className="flex min-h-16 w-full items-center gap-4 rounded-xl px-4 text-left ring-1 ring-line transition-colors hover:bg-sand"
                >
                    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-lg bg-lagoon-tint text-lagoon-ink">
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                        </svg>
                    </span>
                    <span>
                        <span className="block text-sm font-bold text-ink-900">Enviar arquivo</span>
                        <span className="block text-xs text-muted">PDF, imagem, planilha ou documento</span>
                    </span>
                </button>
            </div>
        </Modal>
    );
}
