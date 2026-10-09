/**
 * Aviso de que o ENVIO de um formulário falhou no servidor — limite de envios
 * atingido, candidatura duplicada, sem conexão.
 *
 * Fica logo ACIMA do botão de enviar, e não no topo do formulário. No celular
 * um formulário longo ocupa várias telas: com o aviso no topo, a pessoa toca
 * em "Enviar" lá embaixo, o aviso aparece fora da tela e parece que nada
 * aconteceu. Ela toca de novo — e com o limite de envios por hora do backend,
 * cada toque gasta uma tentativa. O aviso precisa aparecer onde o polegar está.
 *
 * `role="alert"` faz o leitor de tela anunciar o erro na hora, sem que a
 * pessoa precise ir procurá-lo.
 *
 * Quando o servidor respondeu, `error.message` já chega em português: o
 * interceptor do `api.js` copia o `detail` do ProblemDetail para ela. Quando
 * NÃO respondeu (sem internet, servidor fora do ar), não há `response` e o
 * axios preenche a mensagem com "Network Error", em inglês — por isso esse
 * caso tem texto próprio.
 */
const NO_CONNECTION_MESSAGE = 'Não foi possível falar com o servidor. Confira sua internet e tente novamente.';

export default function SubmitError({ title, error }) {
    if (!error) return null;

    return (
        <div role="alert" className="rounded-xl bg-berry-tint p-4 ring-1 ring-inset ring-berry/30">
            <p className="text-sm font-bold text-berry-ink">{title}</p>
            <p className="mt-1 text-sm text-ink-800">
                {error.response ? error.message : NO_CONNECTION_MESSAGE}
            </p>
        </div>
    );
}
