import api from './api';
import { USE_MOCKS } from './config';
import { contactMockService } from '../mocks/contactMock';

/**
 * Contatos — endpoints reais (`ContactController`):
 *   GET  /api/contacts   sempre paginado (PagedModel) — não existe filtro de
 *                        data no backend; `admin/Contacts.jsx` filtra no
 *                        cliente depois de buscar tudo.
 *   POST /api/contacts   JSON puro (este não é multipart)
 */
const contactHttpService = {
    /**
     * `size=100` é a mesma gambiarra do `newsService`: sem paginação real na
     * tela nem filtro de data no backend, é o jeito de "trazer tudo" com o
     * contrato atual. Para de funcionar de verdade no dia em que a ABRASCE
     * receber mais de 100 contatos — nesse ponto o backend precisa ganhar um
     * filtro por data (como `CandidateFilterInput` já tem) e a tela, paginação.
     */
    getAll: async () => {
        const { data } = await api.get('/contacts', { params: { size: 100 } });
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
