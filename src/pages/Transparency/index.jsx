import './style.css';
import './media-query.css';
import { useTransparencyTree } from '../../hooks/useTransparency';
import { Tree } from 'react-arborist';
import Loading from '../../components/Loading';
import { FaFolder, FaFolderOpen, FaFilePdf } from 'react-icons/fa';

function NodeRenderer({ node, style, dragHandle }) {
    return (
        <div
            ref={dragHandle}
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                borderRadius: 4,
            }}
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

function Transparency() {
    const { data, isLoading, isError, error } = useTransparencyTree();

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '80vh' }}>
                <Loading />
            </div>
        );
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <main id='transparency'>
            <section id="resume">
                <h1>TRANSPARÊNCIA</h1>
                <p>A ABRASCE (Associação Brasileira de Apoio a Saúde, a Cultura e a Educação) entende a importância da prestação de contas no terceiro setor e valoriza a transparência e a responsabilidade financeira como pilares fundamentais para manter a confiança de seus doadores e colaboradores. <br /> <br />
                    Para isso, a ABRASCE tem como compromisso prestar contas de forma clara e transparente sobre as atividades desenvolvidas e os recursos financeiros gerenciados pela associação, garantindo que as informações sejam acessíveis e compreensíveis a todos os interessados. <br /> <br />
                    A prestação de contas da ABRASCE inclui a apresentação regular de demonstrações financeiras auditadas, relatórios de atividades, lista de parceiros, certidões negativas de débitos e outras informações relevantes para avaliação do desempenho da organização.</p>
            </section>
            <section id="tree">
                <Tree
                    className="transparencyTree"
                    initialData={data}
                    onActivate={(node) => {
                        if (node.isLeaf) {
                            const encodedPath = node.id
                                .split('/')
                                .map(segment => encodeURIComponent(segment))
                                .join('/');

                            window.open(`http://localhost:8080/api/files/transparency/individual/${encodedPath}`, '_blank');
                        }
                    }}
                    openByDefault={false}
                    disableDrag={true}
                    rowHeight={40}
                    width={1800}
                    height={800}
                >
                    {NodeRenderer}
                </Tree>
            </section>
        </main>
    )
}

export default Transparency;