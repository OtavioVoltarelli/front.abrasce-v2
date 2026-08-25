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
 *   PUT    /api/news/{id}/data          JSON puro (a capa é um id, não arquivo)
 *   PUT    /api/news/{id}/attachment    multipart: "files"
 *   DELETE /api/news/{id}
 *
 * ---------------------------------------------------------------------------
 * A CAPA MUDOU: DE ARQUIVO PARA REFERÊNCIA
 * ---------------------------------------------------------------------------
 * O backend deixou de aceitar upload de capa. `News.coverImage` virou uma
 * `@ManyToOne` para `ReusableFile` — chave estrangeira — e o `NewsInput` pede
 * `coverImageId` (Long, obrigatório).
 *
 * O ganho é grande e vale entender: com a capa guardada como texto, nada
 * garantia que o arquivo existisse (qualquer string passava) e apagar a imagem
 * quebrava em silêncio a capa de todas as notícias que a usavam. Com chave
 * estrangeira, quem valida a existência é o banco, e ele se recusa a apagar um
 * arquivo em uso.
 *
 * Consequência prática: o formulário de notícia não sobe imagem nenhuma. Ele
 * ESCOLHE um arquivo da biblioteca (ver `components/media/MediaField`).
 *
 * Consequência 2: `PUT {id}/data` deixou de ser multipart e virou JSON puro —
 * não há mais arquivo nenhum naquela requisição.
 *
 * ---------------------------------------------------------------------------
 * O QUE AINDA FALTA NO BACKEND
 * ---------------------------------------------------------------------------
 * 1. A PARTE "files" É OBRIGATÓRIA NO POST. `@RequestPart("files")` sem
 *    `required = false` faz o Spring recusar com 400 quando ela não vem — mas
 *    uma notícia pode não ter anexo. `create` abaixo contorna mandando uma
 *    parte vazia; o certo é o backend aceitar a ausência.
 * 2. ATUALIZAR AINDA EXIGE DUAS CHAMADAS (`/data` e `/attachment`), sem
 *    transação entre elas. Se a segunda falhar, a notícia fica com o texto novo
 *    e os anexos velhos, sem nada avisando.
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

    create: async ({ coverImageId, files = [], ...input }) => {
        const form = new FormData();
        form.append('data', jsonPart({ ...input, coverImageId: Number(coverImageId) }));

        if (files.length > 0) {
            files.forEach((file) => form.append('files', file));
        } else {
            /* Contorno do item 1 acima: o Spring exige a parte "files". Um Blob
               vazio com nome vazio faz a parte existir sem enviar arquivo
               nenhum. É gambiarra, está marcada como tal, e sai no dia em que o
               backend puser `required = false`. */
            form.append('files', new Blob([]), '');
        }

        const { data } = await api.post('/news', form);
        return data;
    },

    update: async (id, { coverImageId, files, ...input }) => {
        /* JSON puro: a capa é um id e não há mais arquivo nesta requisição. */
        const { data } = await api.put(`/news/${id}/data`, {
            ...input,
            coverImageId: Number(coverImageId),
        });

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
