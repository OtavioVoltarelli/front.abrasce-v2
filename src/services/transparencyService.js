import api from "./api";

export const transparencyService = {

    getTransparencyTree: async () => {
        const { data } = await api.get('/files/transparency-tree');
        return data;
    }
}