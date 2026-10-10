/**
 * Configuração da camada de dados.
 *
 * A CHAVE DA ETAPA ATUAL: enquanto `VITE_USE_MOCKS` for "true", os services
 * devolvem dados de mentira em vez de chamar o backend. O resto do app não
 * sabe disso — componentes e hooks são idênticos nos dois modos.
 *
 * PARA INTEGRAR COM O BACKEND DE VERDADE, um dia:
 *   1. mude VITE_USE_MOCKS para false no arquivo .env.development
 *   2. suba o backend em VITE_API_URL
 *   3. confira as telas
 *   4. quando estiver tudo certo, apague a pasta src/mocks e as linhas
 *      `USE_MOCKS ? ... : ...` no fim de cada service
 *
 * O antigo `src/config.jsx` tinha URLs de produção escritas no código e
 * concorria com esta variável de ambiente. Duas fontes de verdade para a mesma
 * informação sempre divergem; ele foi removido.
 */

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const API_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Monta a URL pública de um arquivo servido pelo backend
 * (`GET /api/files/{categoria}/{arquivo}`).
 *
 * Nos mocks, `path` já é uma URL completa gerada pelo Vite ao importar a
 * imagem — daí a checagem: se já parece uma URL, devolve como está. Essa
 * checagem é o único remendo que o modo mock exige, e some junto com ele.
 */
export function fileUrl(category, path) {
    if (!path) return '';
    if (/^(https?:|\/|data:|blob:)/.test(path)) return path;
    /* `encodeURIComponent`: o nome físico carrega o nome que a pessoa deu ao
       arquivo ("uuid_Edital #2.pdf"). Sem codificar, o navegador lê o "#"
       como início de âncora e pede só "uuid_Edital " ao servidor — 404. O
       mesmo vale para "?" (vira query string) e "+". A transparência já fazia
       isso em `transparencyFileUrl`; aqui faltava. */
    return `${API_URL}/files/${category}/${encodeURIComponent(path)}`;
}
