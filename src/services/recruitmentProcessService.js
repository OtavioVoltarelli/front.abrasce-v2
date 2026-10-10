import api from './api';
import { USE_MOCKS } from './config';
import { toPage } from './pagination';
import { recruitmentProcessMockService } from '../mocks/recruitmentProcessMock';

/**
 * Processos seletivos — endpoints reais (`RecruitmentProcessController`):
 *
 *   GET    /api/recruitment-process           sempre paginado (PagedModel)
 *   GET    /api/recruitment-process/actives   idem, só os ativos
 *   GET    /api/recruitment-process/{id}
 *   POST   /api/recruitment-process           multipart: "data" + "files"
 *   PUT    /api/recruitment-process/{id}      multipart: "data" + "files"
 *   DELETE /api/recruitment-process/{id}
 *
 * Campos aceitos em `RecruitmentProcessInput`: title, description, active e,
 * só no update, removeAllFiles.
 * Nenhuma data de abertura ou encerramento — quem controla se o processo está
 * aberto é o booleano `active`.
 *
 * Até pouco tempo atrás, `@RequestPart("files")` sem `required = false` fazia
 * criar um processo SEM anexo devolver 400 (mesmo bug das notícias — testei
 * ao vivo e confirmei). Um processo pode perfeitamente não ter edital anexo.
 * `create`/`update` abaixo já faziam a coisa certa do lado do cliente (só
 * mandam "files" quando há arquivo de verdade); o backend corrigiu a falta e
 * reconfirmei ao vivo depois do fix.
 */

const jsonPart = (payload) =>
    new Blob([JSON.stringify(payload)], { type: 'application/json' });

const recruitmentProcessHttpService = {
    /** Ativos e encerrados, mais recente primeiro — usado no painel. */
    getPage: async ({ page, size }) => {
        const { data } = await api.get('/recruitment-process', { params: { page, size } });
        return toPage(data);
    },

    /** Só os abertos — é o que o site público mostra. */
    getActivesPage: async ({ page, size }) => {
        const { data } = await api.get('/recruitment-process/actives', { params: { page, size } });
        return toPage(data);
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

    /**
     * Mesmo contrato do `newsService.update`: `files` ausente = "não mexi nos
     * anexos"; array com arquivos = "esta é a nova lista"; array VAZIO =
     * "fique sem anexo nenhum", que precisa do sinal `removeAllFiles` — sem
     * ele, o backend entende a parte "files" vazia como "mantenha os atuais".
     * Antes este sinal não existia aqui: a tela avisava "ficará sem nenhum
     * anexo", salvava, e os anexos continuavam lá.
     */
    update: async (id, { files, ...input }) => {
        const form = new FormData();
        form.append(
            'data',
            jsonPart({ ...input, removeAllFiles: Array.isArray(files) && files.length === 0 })
        );
        if (Array.isArray(files)) {
            files.forEach((file) => form.append('files', file));
        }

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
