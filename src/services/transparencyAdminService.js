import api from './api';

const BASE = 'api/admin/transparency';

export const uploadTransparencyFile = (file, path) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`${BASE}/upload?path=${encodeURIComponent(path)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteTransparencyPath = (path) =>
    api.delete(`${BASE}?path=${encodeURIComponent(path)}`);

export const moveTransparencyPath = (from, to) =>
    api.put(`${BASE}/move?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);

export const renameTransparencyPath = (path, name) =>
    api.put(`${BASE}/rename?path=${encodeURIComponent(path)}&name=${encodeURIComponent(name)}`);

export const createTransparencyFolder = (path) =>
    api.post(`${BASE}/folder?path=${encodeURIComponent(path)}`);