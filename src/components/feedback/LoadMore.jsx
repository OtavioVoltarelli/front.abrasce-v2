import Button from '../ui/Button';

/**
 * Rodapé de lista paginada: "Mostrando 20 de 57" + botão "Carregar mais".
 *
 * ---------------------------------------------------------------------------
 * POR QUE BOTÃO, E NÃO ROLAGEM INFINITA NEM PÁGINAS NUMERADAS
 * ---------------------------------------------------------------------------
 * · Rolagem infinita (carregar sozinho ao chegar no fim) torna o rodapé do
 *   site inalcançável: toda vez que o dedo chega perto, a lista cresce. E quem
 *   está no 4G paga dados por itens que não pediu.
 * · Páginas numeradas ("1 2 3 … 9") viram alvos de toque minúsculos no
 *   celular, e cada troca de página joga fora o que a pessoa já estava vendo.
 * · O botão é explícito, tem 44px, mantém o que já apareceu na tela e deixa
 *   o rodapé ao alcance.
 *
 * Recebe o resultado de `usePagedQuery` inteiro (`query`). Os campos que usa
 * vêm todos de lá, e passar um a um seria só repetir nome.
 */
export default function LoadMore({ query, noun }) {
    const shown = query.data?.length ?? 0;
    const total = query.totalElements;

    // Lista que coube numa página só: o contador repetiria o total que a tela
    // já mostra em cima, e o botão não teria o que carregar.
    if (!query.hasNextPage && !query.isFetchNextPageError) return null;

    return (
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
            {/* `aria-live`: quem usa leitor de tela fica sabendo que a lista
                cresceu, já que o foco continua no botão e não "vê" os itens
                novos aparecendo acima dele. */}
            <p aria-live="polite" className="text-sm text-muted">
                Mostrando {shown} de {total} {noun}
            </p>

            {query.isFetchNextPageError && (
                <p role="alert" className="text-sm font-medium text-red-700">
                    Não foi possível carregar mais. Verifique a conexão e tente de novo.
                </p>
            )}

            <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="sm:w-auto sm:min-w-64"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
            >
                {query.isFetchingNextPage
                    ? 'Carregando…'
                    : query.isFetchNextPageError
                        ? 'Tentar de novo'
                        : 'Carregar mais'}
            </Button>
        </div>
    );
}
