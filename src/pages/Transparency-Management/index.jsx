import './style.css';
import { useState } from 'react';
import { Tree } from 'react-arborist';
import { FaFolder, FaFolderOpen, FaFilePdf } from 'react-icons/fa';
import { useTransparencyTree } from '../../hooks/useTransparency';
import {
    useUploadTransparency,
    useDeleteTransparency,
    useMoveTransparency,
    useRenameTransparency,
    useCreateTransparencyFolder,
} from '../../hooks/useTransparencyAdmin';
import Loading from '../../components/Loading';

function NodeRenderer({ node, style, dragHandle }) {
    return (
        <div
            ref={dragHandle}
            style={{ ...style, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '0 8px' }}
            onClick={() => node.isInternal && node.toggle()}
        >
            {node.isLeaf ? (
                <FaFilePdf color="red" size={14} />
            ) : node.isOpen ? (
                <FaFolderOpen color="orange" size={14} />
            ) : (
                <FaFolder color="orange" size={14} />
            )}
            <span style={{ fontSize: 14 }}>{node.data.name}</span>
        </div>
    );
}

function TransparencyManagement() {
    const { data, isLoading, isError, error } = useTransparencyTree();

    const [selectedNode, setSelectedNode] = useState(null);
    const [newFolderPath, setNewFolderPath] = useState('');
    const [newName, setNewName] = useState('');
    const [moveTo, setMoveTo] = useState('');

    const upload = useUploadTransparency();
    const remove = useDeleteTransparency();
    const move = useMoveTransparency();
    const rename = useRenameTransparency();
    const createFolder = useCreateTransparencyFolder();

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !selectedNode) return;

        // se selecionou arquivo, sobe para a pasta pai; se selecionou pasta, sobe para ela
        const path = selectedNode.isLeaf
            ? selectedNode.id.substring(0, selectedNode.id.lastIndexOf('/'))
            : selectedNode.id;

        upload.mutate({ file, path });
    };

    const handleDelete = () => {
        if (!selectedNode) return;
        if (!window.confirm(`Deletar "${selectedNode.data.name}"?`)) return;
        remove.mutate({ path: selectedNode.id });
        setSelectedNode(null);
    };

    const handleRename = () => {
        if (!selectedNode || !newName.trim()) return;
        rename.mutate({ path: selectedNode.id, name: newName.trim() });
        setNewName('');
    };

    const handleMove = () => {
        if (!selectedNode || !moveTo.trim()) return;
        const fileName = selectedNode.id.split('/').pop();
        const destination = `${moveTo.trim()}/${fileName}`;
        move.mutate({ from: selectedNode.id, to: destination });
        setMoveTo('');
    };

    const handleCreateFolder = () => {
        if (!newFolderPath.trim()) return;
        createFolder.mutate({ path: newFolderPath.trim() });
        setNewFolderPath('');
    };

    if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><Loading /></div>;
    if (isError) return <div>Erro: {error.message}</div>;

    return (
        <main id="transparency-management">
            <article id="title">
                <h1>Transparência</h1>
            </article>

            <div id="management-layout">

                {/* ÁRVORE */}
                <section id="tree-section">
                    <p id="selected-label">
                        {selectedNode ? `Selecionado: ${selectedNode.data.name}` : 'Nenhum item selecionado'}
                    </p>
                    <Tree
                        data={data}
                        onSelect={(nodes) => setSelectedNode(nodes[0] ?? null)}
                        openByDefault={false}
                        rowHeight={36}
                        width={700}
                        height={600}
                    >
                        {NodeRenderer}
                    </Tree>
                </section>

                {/* PAINEL DE AÇÕES */}
                <aside id="actions-panel">

                    <section className="action-group">
                        <h3>Upload de arquivo</h3>
                        <p className="hint">Selecione uma pasta na árvore para definir o destino</p>
                        <input type="file" accept="application/pdf" onChange={handleUpload} disabled={!selectedNode} />
                    </section>

                    <section className="action-group">
                        <h3>Criar pasta</h3>
                        <input
                            type="text"
                            placeholder="ex: 2024/nova-pasta"
                            value={newFolderPath}
                            onChange={(e) => setNewFolderPath(e.target.value)}
                        />
                        <button onClick={handleCreateFolder} disabled={!newFolderPath.trim()}>
                            Criar
                        </button>
                    </section>

                    <section className="action-group">
                        <h3>Renomear</h3>
                        <p className="hint">Selecione um item na árvore</p>
                        <input
                            type="text"
                            placeholder="Novo nome"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            disabled={!selectedNode}
                        />
                        <button onClick={handleRename} disabled={!selectedNode || !newName.trim()}>
                            Renomear
                        </button>
                    </section>

                    <section className="action-group">
                        <h3>Mover</h3>
                        <p className="hint">Selecione um item na árvore</p>
                        <input
                            type="text"
                            placeholder="Pasta destino (ex: 2024/contratos)"
                            value={moveTo}
                            onChange={(e) => setMoveTo(e.target.value)}
                            disabled={!selectedNode}
                        />
                        <button onClick={handleMove} disabled={!selectedNode || !moveTo.trim()}>
                            Mover
                        </button>
                    </section>

                    <section className="action-group danger">
                        <h3>Deletar</h3>
                        <p className="hint">Selecione um item na árvore</p>
                        <button onClick={handleDelete} disabled={!selectedNode}>
                            Deletar "{selectedNode?.data.name ?? '...'}"
                        </button>
                    </section>

                </aside>
            </div>
        </main>
    );
}

export default TransparencyManagement;