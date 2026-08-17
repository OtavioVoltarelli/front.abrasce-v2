import api from './api';

export async function sendContactForm(data) {
    try {
        const response = await api.post('/contacts', data);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Ocorreu um erro ao enviar o formulário. Tente novamente.';
        throw new Error(message);
    }
};