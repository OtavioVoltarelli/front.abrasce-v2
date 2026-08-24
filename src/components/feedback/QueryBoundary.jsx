import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

/**
 * Concentra os três estados que TODA tela que busca dados precisa tratar:
 * carregando, erro e lista vazia.
 *
 * Sem isso, cada página repete o mesmo `if (isLoading) ... if (isError) ...`
 * com textos e espaçamentos ligeiramente diferentes — e alguém, em algum lugar,
 * esquece de tratar o vazio e entrega uma tela em branco. Tela branca sem
 * explicação é bug de experiência, mesmo quando o código está "certo".
 *
 * Uso:
 *   <QueryBoundary query={query} skeleton={<ListaEsqueleto />} empty={{...}}>
 *       {(dados) => <Lista itens={dados} />}
 *   </QueryBoundary>
 *
 * Repare que `children` é uma FUNÇÃO. Isso garante que ela só roda quando os
 * dados existem — dentro dela, `dados` nunca é undefined.
 */
export default function QueryBoundary({ query, skeleton, empty, errorTitle, children }) {
    const { data, isPending, isError, error, refetch } = query;

    if (isPending) return skeleton ?? null;

    if (isError) {
        return <ErrorState title={errorTitle} error={error} onRetry={() => refetch()} />;
    }

    const isEmpty = Array.isArray(data) ? data.length === 0 : !data;
    if (isEmpty && empty) return <EmptyState {...empty} />;

    return children(data);
}
