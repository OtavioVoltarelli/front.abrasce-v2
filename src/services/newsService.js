import api from "./api";

export const newsService = {

    /* ---------------------------------------------------------------- leitura */

    getTopNews: async (quantity) => {
        const { data } = await api.get(`/news/top/${quantity}`);
        return data;
    },

    getNewsById: async (id) => {
        const { data } = await api.get(`/news/${id}`);
        return data;
    },

    /**
     * Lista completa, usada na área restrita.
     * O backend devolve da mais antiga para a mais nova; a tela quer o
     * contrário. Invertemos AQUI, no service, para a página não precisar
     * saber disso — e usamos toReversed(), que não muda o array original
     * (o .reverse() do v1 mutava o array vindo do cache do React Query).
     */
    getAllNews: async () => {
        const { data } = await api.get('/news');
        return data.toReversed();
    },

    /* ---------------------------------------------------------------- escrita */

    createNews: async (payload) => {
        const { data } = await api.post('/news', payload);
        return data;
    },

    updateNews: async (id, payload) => {
        const { data } = await api.put(`/news/${id}`, payload);
        return data;
    },

    deleteNews: async (id) => {
        await api.delete(`/news/${id}`);
    },

};
