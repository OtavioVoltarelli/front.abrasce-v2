import api from './api';
import { USE_MOCKS } from './config';
import { contactMockService } from '../mocks/contactMock';

/**
 * Contatos — endpoints reais (`ContactController`):
 *   GET  /api/contacts
 *   POST /api/contacts   JSON puro (este não é multipart)
 */
const contactHttpService = {
    getAll: async () => {
        const { data } = await api.get('/contacts');
        return data;
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
