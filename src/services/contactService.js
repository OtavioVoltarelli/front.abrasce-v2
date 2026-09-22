import api from './api';
import { USE_MOCKS } from './config';
import { contactMockService } from '../mocks/contactMock';

/**
 * Contatos — endpoints reais (`ContactController`):
 *   GET  /api/contacts?startDate&finalDate   sempre paginado (PagedModel);
 *                        `startDate`/`finalDate` são opcionais, mesmo formato
 *                        e convenção de `CandidateFilterInput`.
 *   POST /api/contacts   JSON puro (este não é multipart)
 */
const contactHttpService = {
    /**
     * `size=100` ainda é a mesma gambiarra do `newsService`: sem paginação
     * real na tela, é o jeito de "trazer tudo" com o contrato atual. O filtro
     * de data já é de verdade (vira query param, filtra no backend) — só a
     * paginação continua pendente.
     */
    getAll: async ({ startDate, finalDate } = {}) => {
        const { data } = await api.get('/contacts', { params: { startDate, finalDate, size: 100 } });
        return data.content ?? [];
    },

    /**
     * Atenção: no backend `phoneNumber` do contato é `Long`, não String.
     * Mandar "(11) 99999-9999" resulta em 400. Convertemos para dígitos aqui,
     * no service — é o lugar certo: a tela mostra o telefone bonito para a
     * pessoa, e a camada de dados entrega ao backend o que ele espera.
     */
    send: async ({ phoneNumber, ...rest }) => {
        const { data } = await api.post('/contacts', {
            ...rest,
            phoneNumber: Number(String(phoneNumber).replace(/\D/g, '')),
        });
        return data;
    },
};

export const contactService = USE_MOCKS ? contactMockService : contactHttpService;
