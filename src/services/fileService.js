import api from './api';

/**
 * Upload e leitura de arquivos.
 *
 * Estava duplicado dentro de News-Management e RecruitmentProcess no v1 —
 * as duas páginas montavam o mesmo FormData na mão. Centralizado aqui.
 */

/** Limites aceitos pelo backend, em bytes. */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024;    // 10 MB

/**
 * Envia um arquivo e devolve a URL (string) gerada pelo backend.
 * O endpoint responde texto puro, não JSON — daí o responseType.
 */
export const uploadFile = async (file, directory) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post('/files/upload', formData, {
        params: directory ? { directory } : undefined,
        responseType: 'text',
    });

    return data;
};

/** Monta a URL pública de um arquivo já enviado. */
export const buildFileUrl = (fileName) =>
    `${import.meta.env.VITE_API_URL}/files/${fileName}`;

/**
 * URL de PDF de notícia.
 * ⚠️ O v1 montava `files/documents${pdfUrl}` — sem barra entre as partes,
 * assumindo que pdfUrl já começa com "/". Comportamento preservado à risca;
 * vale confirmar contra o backend v2 e simplificar depois.
 */
export const buildNewsPdfUrl = (pdfUrl) =>
    `${import.meta.env.VITE_API_URL}/files/documents${pdfUrl}`;
