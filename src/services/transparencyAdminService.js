import api from './api';

/**
 * Administração dos arquivos de transparência (`TransparencyAdminController`).
 *
 * CORREÇÃO em relação ao código anterior: a base era `'api/admin/transparency'`,
 * mas o `baseURL` do axios já termina em `/api`. A URL final ficava
 * `/api/api/admin/transparency` e toda chamada respondia 404. O sinal que
 * denunciava: repetição do prefixo entre a base do cliente HTTP e a base do
 * service. Quando os dois definem "/api", um dos dois está errado.
 *
 * Esta tela não faz parte do redesenho pedido (o novo painel cobre processos
 * seletivos, notícias, candidatos e contatos). O service foi mantido para a
 * funcionalidade não se perder.
 */
const BASE = '/admin/transparency';

export const uploadTransparencyFile = (file, path) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`${BASE}/upload`, formData, { params: { path } });
};

export const deleteTransparencyPath = (path) => api.delete(BASE, { params: { path } });

export const moveTransparencyPath = (from, to) =>
    api.put(`${BASE}/move`, null, { params: { from, to } });

export const renameTransparencyPath = (path, name) =>
    api.put(`${BASE}/rename`, null, { params: { path, name } });

export const createTransparencyFolder = (path) =>
    api.post(`${BASE}/folder`, null, { params: { path } });
