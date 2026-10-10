import api from './api';
import { USE_MOCKS } from './config';
import { toPage } from './pagination';
import { onlyDigits } from '../lib/format';
import { contactMockService } from '../mocks/contactMock';

/**
 * Contatos — endpoints reais (`ContactController`):
 *   GET  /api/contacts?startDate&finalDate   sempre paginado (PagedModel);
 *                        `startDate`/`finalDate` são opcionais, mesmo formato
 *                        e convenção de `CandidateFilterInput`.
 *   POST /api/contacts   JSON puro (este não é multipart)
 */
const contactHttpService = {
    getPage: async ({ startDate, finalDate, page, size }) => {
        const { data } = await api.get('/contacts', { params: { startDate, finalDate, page, size } });
        return toPage(data);
    },

    /**
     * O telefone vai só com os dígitos ("11999999999"), como TEXTO. A tela
     * mostra "(11) 99999-9999" para a pessoa; a camada de dados entrega ao
     * backend o formato canônico, sem máscara.
     *
     * Já foi `Number(...)`, quando o backend guardava telefone como `Long` e um
     * "0" à esquerda sumia no caminho. Telefone não é número: ninguém soma
     * telefones, e um tipo numérico apaga zeros e o "+" do código de país.
     */
    send: async ({ phoneNumber, ...rest }) => {
        const { data } = await api.post('/contacts', {
            ...rest,
            phoneNumber: onlyDigits(phoneNumber),
        });
        return data;
    },
};

export const contactService = USE_MOCKS ? contactMockService : contactHttpService;
