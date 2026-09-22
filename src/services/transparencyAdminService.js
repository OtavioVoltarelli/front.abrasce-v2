import api from './api';
import { USE_MOCKS } from './config';
import { transparencyAdminMockService } from '../mocks/transparencyMock';

/**
 * Administração dos arquivos de transparência (`TransparencyAdminController`).
 *
 * Todo `path`/`from`/`to` aqui é um caminho de verdade no disco do servidor —
 * ver `FileService.java`. Duas consequências que moldam quem chama isto:
 *
 *   1. `to`, em `move`, é o caminho de destino COMPLETO, nome do arquivo/pasta
 *      incluído — não só a pasta destino. Quem chama monta
 *      `pastaDestino + '/' + nomeAtual`.
 *   2. Upload e mover SOBRESCREVEM em silêncio um item de mesmo nome no
 *      destino (`REPLACE_EXISTING` no backend). A tela avisa antes de deixar
 *      escolher um destino com colisão.
 *
 * Todos os endpoints devolvem 200 sem corpo — nenhum método aqui devolve nada
 * além da confirmação; quem chama invalida a árvore (`useTransparencyTree`) e
 * busca de novo.
 */
const BASE = '/admin/transparency';

const transparencyAdminHttpService = {
    upload: (file, path) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`${BASE}/upload`, formData, { params: { path } });
    },

    createFolder: (path) => api.post(`${BASE}/folder`, null, { params: { path } }),

    rename: (path, name) => api.put(`${BASE}/rename`, null, { params: { path, name } }),

    move: (from, to) => api.put(`${BASE}/move`, null, { params: { from, to } }),

    remove: (path) => api.delete(BASE, { params: { path } }),
};

export const transparencyAdminService = USE_MOCKS
    ? transparencyAdminMockService
    : transparencyAdminHttpService;
