import api from './api';
import { USE_MOCKS } from './config';
import { toPage } from './pagination';
import { reusableFileMockService } from '../mocks/reusableFileMock';

/**
 * Biblioteca de arquivos reutilizáveis — `ReusableFileController` do backend v2.
 *
 *   GET    /api/reusable-files?search&kind  paginado (PagedModel); busca e
 *                                           filtro por tipo rodam no servidor
 *   GET    /api/reusable-files/{id}/usages  quem usa o arquivo (paginado)
 *   GET    /api/reusable-files/{id}
 *   GET    /api/reusable-files/{id}/download   baixa com o nome original
 *   POST   /api/reusable-files              multipart: "file" + "data" (JSON)
 *   PUT    /api/reusable-files/{id}         JSON: { name } — só o rótulo
 *   PUT    /api/reusable-files/{id}/file    multipart: "file" — troca o arquivo
 *   DELETE /api/reusable-files/{id}         409 se estiver em uso como capa
 *
 * ---------------------------------------------------------------------------
 * DUAS OPERAÇÕES DE EDIÇÃO SEPARADAS, E ISSO É PROPOSITAL
 * ---------------------------------------------------------------------------
 * Renomear (`PUT {id}`) e trocar o arquivo (`PUT {id}/file`) são endpoints
 * diferentes. Parece burocracia, mas é o que permite corrigir o rótulo de uma
 * imagem de 3 MB sem reenviar os 3 MB — o que num celular em 4G é a diferença
 * entre instantâneo e trinta segundos.
 *
 * E trocar o arquivo MANTÉM o id: quem já aponta para ele passa a ver o
 * conteúdo novo. É o que permite atualizar uma capa usada em dez notícias de
 * uma vez, em vez de editar as dez.
 *
 * ---------------------------------------------------------------------------
 * BUSCA E USO SAÍRAM DO NAVEGADOR
 * ---------------------------------------------------------------------------
 * A busca por nome, o filtro por tipo e a contagem de uso eram calculados no
 * navegador, em cima da lista INTEIRA de arquivos e de notícias. Isso só
 * funciona enquanto "a lista inteira" cabe numa resposta. Com paginação, a
 * tela só conhece a página que carregou, e filtrar ali mostraria "nenhum
 * resultado" para um arquivo que está na página 3.
 *
 * Por isso o backend passou a fazer as três coisas:
 * · `search` procura no rótulo e no nome original; `kind` filtra pelo tipo,
 *   que o backend classifica no upload com a mesma regra de `lib/fileKind`.
 * · `usageCount` vem em cada arquivo (é o que o card mostra), e `/usages`
 *   lista QUEM usa, para a gaveta explicar por que a exclusão está travada.
 *   O `usageCount` só vem preenchido nas rotas da biblioteca: dentro de
 *   `NewsOutput.coverImage` ele é null.
 */

/** A parte "data" tem que ir como Blob com type application/json, senão o
 *  navegador manda text/plain e o @RequestPart do Spring responde 415. */
const jsonPart = (payload) =>
    new Blob([JSON.stringify(payload)], { type: 'application/json' });

const reusableFileHttpService = {
    /** `kind` "all" e busca vazia viram "sem filtro": o parâmetro nem vai. */
    getPage: async ({ search, kind, page, size }) => {
        const { data } = await api.get('/reusable-files', {
            params: { search: search?.trim() || undefined, kind: kind === 'all' ? undefined : kind, page, size },
        });
        return toPage(data);
    },

    getUsagesPage: async (id, { page, size }) => {
        const { data } = await api.get(`/reusable-files/${id}/usages`, { params: { page, size } });
        return toPage(data);
    },

    getById: async (id) => {
        const { data } = await api.get(`/reusable-files/${id}`);
        return data;
    },

    create: async ({ file, name }) => {
        const form = new FormData();
        form.append('file', file);
        // O nome é opcional no `ReusableFileInput`: sem ele, o backend usa o
        // nome do arquivo sem a extensão. Mandamos string vazia em vez de
        // omitir o campo para que o record chegue completo à validação.
        form.append('data', jsonPart({ name: name?.trim() || null }));

        const { data } = await api.post('/reusable-files', form);
        return data;
    },

    rename: async (id, { name }) => {
        const { data } = await api.put(`/reusable-files/${id}`, { name: name.trim() });
        return data;
    },

    replaceFile: async (id, file) => {
        const form = new FormData();
        form.append('file', file);
        const { data } = await api.put(`/reusable-files/${id}/file`, form);
        return data;
    },

    remove: async (id) => {
        await api.delete(`/reusable-files/${id}`);
    },

    /**
     * O arquivo como Blob, para baixar com o NOME ORIGINAL ("edital-2026.pdf",
     * e não "947ebbe2-…-edital-2026.pdf") — é por isso que o backend tem esta
     * rota separada da que serve a imagem.
     *
     * A rota exige login, então não pode ser um `<a href>`: o navegador
     * seguiria o link sem o token, que só o axios envia.
     */
    download: async (id) => {
        const { data } = await api.get(`/reusable-files/${id}/download`, { responseType: 'blob' });
        return data;
    },
};

export const reusableFileService = USE_MOCKS
    ? reusableFileMockService
    : reusableFileHttpService;
