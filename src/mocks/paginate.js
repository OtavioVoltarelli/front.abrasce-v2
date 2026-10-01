/**
 * Recorta uma lista em memória no MESMO formato que `toPage` produz a partir da
 * resposta do backend. É o que permite a tela testar o "Carregar mais" sem
 * servidor: sem isso, o mock devolveria tudo de uma vez e o botão nunca
 * apareceria em modo mock.
 */
export function paginate(list, { page = 0, size = 20 } = {}) {
    const start = page * size;
    return {
        items: list.slice(start, start + size),
        page,
        totalPages: Math.ceil(list.length / size),
        totalElements: list.length,
    };
}
