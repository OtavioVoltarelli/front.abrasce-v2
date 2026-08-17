import api from './api';

export async function createCandidate(formData) {
    const { cvUrl, ...candidateData } = formData;

    const form = new FormData();

    // "data" precisa ser um Blob com o tipo application/json
    // pois o @RequestPart do Spring precisa saber que é JSON
    form.append(
        'data',
        new Blob([JSON.stringify(candidateData)], { type: 'application/json' })
    );

    // "cv" é o arquivo direto, é o outro @RequestPart
    form.append('cv', cvUrl);

    try {
        const { data } = await api.post(`/candidates`, form);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'Ocorreu um erro ao processar a solicitação. Tente novamente.';
        throw new Error(message);
    }
    const { data } = await api.post(`/candidates`, form);
}