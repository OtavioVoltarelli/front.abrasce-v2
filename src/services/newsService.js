import api from './api';
import { USE_MOCKS } from './config';
import { newsMockService } from '../mocks/newsMock';

/**
 * Notícias — endpoints reais do backend v2 (`NewsController`):
 *
 *   GET    /api/news                    lista completa
 *   GET    /api/news/top                últimas, paginado (PagedModel)
 *   GET    /api/news/{id}
 *   POST   /api/news                    multipart: "data" (JSON) + "files"
 *   PUT    /api/news/{id}/data          multipart: "data" (JSON) + "coverImage" (String)
 *   PUT    /api/news/{id}/attachment    multipart: "files"
 *   DELETE /api/news/{id}
 *
 * ---------------------------------------------------------------------------
 * ⚠️ TRÊS PONTOS DO BACKEND QUE PRECISAM SER RESOLVIDOS ANTES DA INTEGRAÇÃO
 * ---------------------------------------------------------------------------
 * 1. NÃO EXISTE UPLOAD DA IMAGEM DE CAPA. `NewsInput.coverImagePath` é uma
 *    String @NotBlank, e a parte "files" do POST vira a lista de ANEXOS
 *    (`filesPath`), não a capa. Ou seja: hoje o administrador teria que digitar
 *    à mão o nome de um arquivo que já esteja no servidor. O formulário desta
 *    tela oferece o upload da capa, que é o certo do ponto de vista de uso;
 *    o backend precisa aceitá-la como uma parte do multipart.
 *
 * 2. A PARTE "files" É OBRIGATÓRIA. `@RequestPart("files")` sem
 *    `required = false` faz o Spring recusar a requisição com 400 quando ela
 *    não vem. Mas o briefing diz que uma notícia PODE não ter anexo. Um dos
 *    dois precisa mudar — e o certo é o backend aceitar a lista vazia.
 *
 * 3. ATUALIZAR EXIGE DUAS CHAMADAS. Os dados vão em `PUT {id}/data` e os
 *    anexos em `PUT {id}/attachment`. Se a segunda falhar, a notícia fica com
 *    o texto novo e os anexos velhos, sem nada avisando. O ideal é um endpoint
 *    só, numa transação só.
 *
 * Enquanto isso, `update` abaixo faz as duas chamadas em sequência e a segunda
 * só acontece se o formulário realmente trocou os anexos.
 */

/** A parte "data" tem que ir como Blob com type application/json, senão o
 *  navegador manda text/plain e o @RequestPart do Spring responde 415. */
const jsonPart = (payload) =>
    new Blob([JSON.stringify(payload)], { type: 'application/json' });

const newsHttpService = {
    getAll: async () => {
        const { data } = await api.get('/news');
        return data;
    },

    /**
     * `/news/top` responde um PagedModel do Spring: os itens vêm dentro de
     * `content`. Desembrulhamos AQUI para que nenhuma tela precise saber que
     * este endpoint é paginado e os outros não.
     */
    getLatest: async (quantity = 6) => {
        const { data } = await api.get('/news/top', { params: { size: quantity } });
        return data.content ?? [];
    },

    getById: async (id) => {
        const { data } = await api.get(`/news/${id}`);
        return data;
    },

    create: async ({ coverImage, files = [], ...input }) => {
        const form = new FormData();
        form.append('data', jsonPart({ ...input, coverImagePath: coverImage?.name ?? '' }));
        files.forEach((file) => form.append('files', file));

        const { data } = await api.post('/news', form);
        return data;
    },

    update: async (id, { coverImage, files, ...input }) => {
        const form = new FormData();
        form.append('data', jsonPart({ ...input, coverImagePath: coverImage?.name ?? '' }));
        form.append('coverImage', coverImage?.name ?? '');

        const { data } = await api.put(`/news/${id}/data`, form);

        // `files` só vem definido quando a pessoa mexeu nos anexos. Sem esta
        // checagem, editar apenas o título apagaria todos os anexos.
        if (files) {
            const attachmentForm = new FormData();
            files.forEach((file) => attachmentForm.append('files', file));
            const { data: withFiles } = await api.put(`/news/${id}/attachment`, attachmentForm);
            return withFiles;
        }

        return data;
    },

    remove: async (id) => {
        await api.delete(`/news/${id}`);
    },
};

export const newsService = USE_MOCKS ? newsMockService : newsHttpService;
