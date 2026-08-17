import api from "./api";

export const recruitmentProcessService = {

    /* ---------------------------------------------------------------- leitura */

    getActivesRecruitmentProcesses: async () => {
        const { data } = await api.get(`/recruitment-process/actives`);
        return data;
    },

    getRecruitmentProcessById: async (id) => {
        const { data } = await api.get(`/recruitment-process/${id}`);
        return data;
    },

    /** Lista completa (ativos e inativos), usada na área restrita. */
    getAllRecruitmentProcesses: async () => {
        const { data } = await api.get('/recruitment-process');
        return data.toReversed();
    },

    /* ---------------------------------------------------------------- escrita */

    createRecruitmentProcess: async (payload) => {
        const { data } = await api.post('/recruitment-process', payload);
        return data;
    },

    updateRecruitmentProcess: async (id, payload) => {
        const { data } = await api.put(`/recruitment-process/${id}`, payload);
        return data;
    },

    deleteRecruitmentProcess: async (id) => {
        await api.delete(`/recruitment-process/${id}`);
    },

};
