import api from './api';
import { USE_MOCKS, fileUrl } from './config';
import { reusableFileMockService } from '../mocks/reusableFileMock';

/**
 * Biblioteca de arquivos reutilizáveis — `ReusableFileController` do backend v2.
 *
 *   GET    /api/reusable-files              sempre paginado (PagedModel), igual
 *                                           a todo outro GET de lista do backend
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
 * O QUE FALTA NO BACKEND
 * ---------------------------------------------------------------------------
 * · `GET /api/reusable-files` não tem busca nem filtro por tipo no servidor —
 *   e É paginado (`size=100` abaixo é a mesma gambiarra de "trazer tudo" que
 *   os outros services HTTP usam, até existir paginação de verdade na tela).
 *   Com algumas dezenas de arquivos está ótimo; passando de cem por vez, a
 *   busca precisa ir para o servidor. Hoje ela é feita no navegador
 *   (`useFilteredFiles`), e é por isso que a filtragem está isolada num hook:
 *   no dia em que virar `?search=&type=`, muda um arquivo só.
 * · Não existe endpoint que diga QUANTAS notícias usam um arquivo. O backend
 *   sabe (`existsByCoverImageId`), mas só usa isso para recusar o DELETE. A
 *   tela calcula a contagem cruzando com a lista de notícias que já está em
 *   cache — ver `useFileUsage`.
 */

/** A parte "data" tem que ir como Blob com type application/json, senão o
 *  navegador manda text/plain e o @RequestPart do Spring responde 415. */
const jsonPart = (payload) =>
    new Blob([JSON.stringify(payload)], { type: 'application/json' });

const reusableFileHttpService = {
    getAll: async () => {
        const { data } = await api.get('/reusable-files', { params: { size: 100 } });
        return data.content ?? [];
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
};

export const reusableFileService = USE_MOCKS
    ? reusableFileMockService
    : reusableFileHttpService;

/**
 * URL para baixar o arquivo com o NOME ORIGINAL ("edital-2026.pdf", e não
 * "947ebbe2-…-edital-2026.pdf"). É por isso que o backend tem uma rota de
 * download separada da rota que serve a imagem: `<img src>` não mostra nome
 * nenhum, mas um download mostra.
 *
 * Em modo mock não existe servidor, e o `storedName` já é a URL do arquivo
 * empacotado — então o link aponta direto para ele. Esta decisão fica AQUI, no
 * service, e não no componente: a tela não deveria saber se os dados vêm de
 * mock ou de API, essa é a fronteira inteira desta camada.
 */
export const reusableFileDownloadUrl = (file) =>
    USE_MOCKS
        ? fileUrl('admin', file.storedName)
        : `${api.defaults.baseURL ?? ''}/reusable-files/${file.id}/download`;
