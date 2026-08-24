import api from './api';
import { USE_MOCKS } from './config';
import { recruitmentProcessMockService } from '../mocks/recruitmentProcessMock';

/**
 * Processos seletivos — endpoints reais (`RecruitmentProcessController`):
 *
 *   GET    /api/recruitment-process           todos
 *   GET    /api/recruitment-process/actives   só os ativos
 *   GET    /api/recruitment-process/{id}
 *   POST   /api/recruitment-process           multipart: "data" + "files"
 *   PUT    /api/recruitment-process/{id}      multipart: "data" + "files"
 *   DELETE /api/recruitment-process/{id}
 *
 * Campos aceitos em `RecruitmentProcessInput`: title, description, active.
 * Nenhuma data de abertura ou encerramento — quem controla se o processo está
 * aberto é o booleano `active`.
 *
 * ⚠️ Mesmo problema das notícias: `@RequestPart("files")` é obrigatório, então
 * criar um processo SEM anexo devolve 400. O briefing diz que um processo pode
 * não ter edital anexo. O backend precisa aceitar a lista vazia.
 */

const jsonPart = (payload) =>
    new Blob([JSON.stringify(payload)], { type: 'application/json' });

const recruitmentProcessHttpService = {
    getAll: async () => {
        const { data } = await api.get('/recruitment-process');
        return data;
    },

    getActives: async () => {
        const { data } = await api.get('/recruitment-process/actives');
        return data;
    },

    getById: async (id) => {
        const { data } = await api.get(`/recruitment-process/${id}`);
        return data;
    },

    create: async ({ files = [], ...input }) => {
        const form = new FormData();
        form.append('data', jsonPart(input));
        files.forEach((file) => form.append('files', file));

        const { data } = await api.post('/recruitment-process', form);
        return data;
    },

    update: async (id, { files = [], ...input }) => {
        const form = new FormData();
        form.append('data', jsonPart(input));
        files.forEach((file) => form.append('files', file));

        const { data } = await api.put(`/recruitment-process/${id}`, form);
        return data;
    },

    remove: async (id) => {
        await api.delete(`/recruitment-process/${id}`);
    },
};

export const recruitmentProcessService = USE_MOCKS
    ? recruitmentProcessMockService
    : recruitmentProcessHttpService;
