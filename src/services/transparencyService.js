import api from './api';
import { USE_MOCKS, API_URL } from './config';
import { transparencyMockService } from '../mocks/transparencyMock';

/** Transparência — `GET /api/files/transparency-tree` (`FileController`). */
const transparencyHttpService = {
    getTree: async () => {
        const { data } = await api.get('/files/transparency-tree');
        return data;
    },
};

export const transparencyService = USE_MOCKS
    ? transparencyMockService
    : transparencyHttpService;

/**
 * URL para abrir um documento da transparência.
 *
 * O caminho pode ter espaço e acento ("Relatórios de atividades/balanço.pdf"),
 * então cada segmento precisa ser codificado — mas as barras, não, senão o
 * backend recebe um nome de arquivo único em vez de um caminho.
 * (No código antigo o host `localhost:8080` estava escrito à mão dentro do
 * componente; em produção isso simplesmente não abriria.)
 */
export const transparencyFileUrl = (path) => {
    const encoded = String(path).split('/').map(encodeURIComponent).join('/');
    return `${API_URL}/files/transparency/individual/${encoded}`;
};
