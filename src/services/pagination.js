/**
 * Paginação — o contrato de TODA listagem do backend v2.
 *
 * O Spring devolve um `PagedModel`:
 *
 *   { content: [...], page: { size, number, totalElements, totalPages } }
 *
 * `toPage` achata isso num formato do próprio front, e é o ÚNICO lugar que
 * conhece o formato do Spring. Hook e tela só veem `{ items, page, totalPages,
 * totalElements }` — se o backend um dia trocar de envelope, muda este arquivo.
 *
 * `page` começa em ZERO (convenção do Spring). A tela nunca mostra esse número,
 * então não há "página 0" aparecendo para ninguém.
 */
export function toPage(pagedModel) {
    const meta = pagedModel?.page ?? {};
    return {
        items: pagedModel?.content ?? [],
        page: meta.number ?? 0,
        totalPages: meta.totalPages ?? 0,
        totalElements: meta.totalElements ?? 0,
    };
}

/**
 * Maior página que o front pede de uma vez. O backend aceita até 2000 (padrão
 * do Spring), mas 100 mantém cada resposta pequena o bastante para não travar
 * um celular fraco montando o JSON.
 */
const BULK_PAGE_SIZE = 100;

/**
 * Busca TODAS as páginas, uma depois da outra, e devolve a lista inteira.
 *
 * Só serve para os casos em que "tudo" é mesmo o requisito: exportar a planilha
 * do período e preencher um <select> com todos os processos seletivos. Para
 * mostrar uma lista na tela, use paginação de verdade (`usePagedQuery`).
 *
 * As páginas vão em SEQUÊNCIA, não em paralelo: o total só é conhecido depois
 * da primeira resposta, e disparar vinte requisições de uma vez num 4G fraco
 * deixaria todas lentas em vez de uma rápida de cada vez.
 */
export async function fetchAllItems(fetchPage) {
    const items = [];
    let page = 0;
    let totalPages = 1;

    while (page < totalPages) {
        const result = await fetchPage({ page, size: BULK_PAGE_SIZE });
        items.push(...result.items);
        totalPages = result.totalPages;
        page += 1;
    }

    return items;
}
