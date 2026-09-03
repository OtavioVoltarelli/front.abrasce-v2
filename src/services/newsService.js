import api from './api';
import { USE_MOCKS } from './config';
import { newsMockService } from '../mocks/newsMock';

/**
 * Notícias — endpoints reais do backend v2 (`NewsController`):
 *
 *   GET    /api/news                    ÚNICA rota de listagem — sempre paginada
 *                                        (PagedModel), mesmo sem parâmetro nenhum.
 *                                        Não existe `/api/news/top`: "últimas N" é
 *                                        só `?size=N` nesta mesma rota.
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
 * "files" JÁ FOI OPCIONAL — HISTÓRICO
 * ---------------------------------------------------------------------------
 * Até pouco tempo atrás, `@RequestPart("files")` sem `required = false` fazia
 * o Spring recusar com 400 quando a notícia não tinha anexo — testei ao vivo
 * e confirmei que era IMPOSSÍVEL criar notícia sem arquivo. O backend corrigiu
 * (`required = false` + `FileService.saveFileList` tratando `null` como lista
 * vazia); reconfirmei ao vivo depois do fix. `create` abaixo já fazia a coisa
 * certa do lado do cliente (só manda "files" quando existe arquivo de
 * verdade) — não precisou mudar nada aqui, só esperar o backend.
 *
 * ---------------------------------------------------------------------------
 * O QUE AINDA FALTA NO BACKEND
 * ---------------------------------------------------------------------------
 * ATUALIZAR AINDA EXIGE DUAS CHAMADAS (`/data` e `/attachment`), sem transação
 * entre elas. Se a segunda falhar, a notícia fica com o texto novo e os
 * anexos velhos, sem nada avisando.
 */

/** A parte "data" tem que ir como Blob com type application/json, senão o
 *  navegador manda text/plain e o @RequestPart do Spring responde 415. */
const jsonPart = (payload) =>
    new Blob([JSON.stringify(payload)], { type: 'application/json' });

const newsHttpService = {
    /**
     * `/news` responde um PagedModel do Spring: os itens vêm dentro de
     * `content`, não no corpo direto. Desembrulhamos AQUI para que nenhuma
     * tela precise saber que o endpoint é paginado.
     *
     * PENDÊNCIA: `size=100` é gambiarra, não paginação de verdade — funciona
     * enquanto o site tiver poucas dezenas de notícias e para de trazer tudo
     * no dia em que passar de 100. `News/index.jsx` e `admin/NewsList.jsx`
     * foram escritas para uma lista completa (sem "carregar mais"); paginação
     * real exige mudar as duas telas, não só este service.
     */
    getAll: async () => {
        const { data } = await api.get('/news', { params: { size: 100 } });
        return data.content ?? [];
    },

    getLatest: async (quantity = 6) => {
        const { data } = await api.get('/news', { params: { size: quantity } });
        return data.content ?? [];
    },

    getById: async (id) => {
        const { data } = await api.get(`/news/${id}`);
        return data;
    },

    create: async ({ coverImageId, files = [], ...input }) => {
        const form = new FormData();
        form.append('data', jsonPart({ ...input, coverImageId: Number(coverImageId) }));

        // Só manda a parte "files" quando existe arquivo de verdade — sem
        // anexo, o backend aceita a ausência da parte (ver histórico acima).
        files.forEach((file) => form.append('files', file));

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
