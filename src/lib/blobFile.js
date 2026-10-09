/**
 * Entregar à pessoa um arquivo que veio da API como Blob — o caminho para
 * qualquer arquivo de rota com login, que não pode ser um `<a href>`.
 *
 * `URL.createObjectURL` dá ao Blob um endereço temporário (`blob:...`) que só
 * existe nesta aba do navegador. Ele segura o arquivo na memória até ser
 * liberado com `revokeObjectURL` — por isso todo endereço criado aqui é
 * liberado depois de um tempo.
 */

/* Tempo para o navegador terminar de carregar o arquivo antes de liberar a
   memória. Liberar na hora quebraria o carregamento na aba nova. */
const REVOKE_DELAY_MS = 60_000;

/** Tipos que o navegador mostra sozinho numa aba. O resto, ele baixaria. */
export const canShowInTab = (contentType = '') =>
    contentType === 'application/pdf' || contentType.startsWith('image/') || contentType.startsWith('text/');

/**
 * Abre uma aba vazia AGORA, de forma síncrona, ainda dentro do clique.
 *
 * O bloqueador de pop-up só deixa abrir aba como resposta direta a um clique.
 * Baixar o arquivo leva tempo (um `await`), e uma aba aberta depois disso já
 * não conta como resposta ao clique — seria bloqueada, principalmente no
 * Safari do iPhone. Então a aba nasce vazia no clique e recebe o arquivo
 * quando ele chegar (`showBlobInTab`). Devolve `null` se foi bloqueada mesmo
 * assim.
 */
export const openPendingTab = () => window.open('', '_blank');

/** Mostra o Blob na aba aberta por `openPendingTab`. */
export function showBlobInTab(tab, blob) {
    const url = URL.createObjectURL(blob);
    tab.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}

/**
 * Baixa o Blob com o nome certo. Sem o atributo `download`, o arquivo seria
 * salvo com o nome do endereço temporário — um código aleatório sem extensão,
 * que o celular não sabe com que aplicativo abrir.
 */
export function saveBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}
