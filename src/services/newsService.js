import api from './api';
import { USE_MOCKS } from './config';
import { newsMockService } from '../mocks/newsMock';

/**
 * Notícias — endpoints reais do backend v2 (`NewsController`):
 *
 *   GET    /api/news       ÚNICA rota de listagem — sempre paginada (PagedModel),
 *                          mesmo sem parâmetro nenhum. Não existe `/api/news/top`:
 *                          "últimas N" é só `?size=N` nesta mesma rota.
 *   GET    /api/news/{id}
 *   POST   /api/news       multipart: "data" (JSON) + "files"
 *   PUT    /api/news/{id}  multipart: "data" (JSON) + "files" (opcional)
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
 * ATUALIZAR VIROU UMA CHAMADA SÓ — E "REMOVER TODOS OS ANEXOS" PRECISA DE SINAL EXPLÍCITO
 * ---------------------------------------------------------------------------
 * Até pouco tempo, editar notícia exigia DUAS chamadas (`PUT {id}/data` +
 * `PUT {id}/attachment`), sem transação entre elas: se a segunda falhasse, a
 * notícia ficava com o texto novo e os anexos velhos, sem nada avisando quem
 * editou. O backend unificou em `PUT /news/{id}`, no mesmo formato do `create`.
 *
 * Isso trouxe uma pegadinha: a parte "files" vazia agora significa "não mexi
 * nos anexos" (mantém os atuais), não "esvazie a lista" — diferente do
 * endpoint antigo. Sem um sinal aparte, não haveria como esvaziar. Por isso
 * o `NewsInput` ganhou `removeAllFiles` (boolean): `true` apaga os anexos
 * atuais mesmo que "files" venha vazia; ausente/false + "files" com itens
 * substitui a lista; ausente/false + "files" vazia mantém os anexos atuais.
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
        const form = new FormData();
        form.append(
            'data',
            jsonPart({
                ...input,
                coverImageId: Number(coverImageId),
                // `files` array VAZIO é o sinal de "Substituir todos os anexos"
                // sem escolher nenhum novo (ver MultiFileUpload) — a pessoa quer
                // a notícia sem anexo nenhum. Sem `removeAllFiles`, o backend
                // entenderia "não mexi nos anexos" e manteria os antigos.
                removeAllFiles: Array.isArray(files) && files.length === 0,
            })
        );

        // `files` só vem definido (array) quando a pessoa mexeu nos anexos.
        // `null` significa "não mexi nisso" — nem manda a parte, nem pede remoção.
        if (Array.isArray(files)) {
            files.forEach((file) => form.append('files', file));
        }

        const { data } = await api.put(`/news/${id}`, form);
        return data;
    },

    remove: async (id) => {
        await api.delete(`/news/${id}`);
    },
};

export const newsService = USE_MOCKS ? newsMockService : newsHttpService;
