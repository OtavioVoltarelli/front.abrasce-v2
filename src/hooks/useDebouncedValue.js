import { useEffect, useState } from 'react';

/**
 * Devolve `value` só depois que ele PAROU de mudar por `delayMs`.
 *
 * É o "debounce" da busca: digitando "relatório", o campo muda 9 vezes, mas a
 * busca no servidor roda uma vez só, quando o dedo para. Sem isso, cada letra
 * dispararia uma requisição e, no 4G, as respostas chegariam fora de ordem.
 *
 * Por que não `useDeferredValue`, que o React já traz? Ele adia a
 * RENDERIZAÇÃO para manter a digitação fluida, mas não promete pular valores
 * intermediários: num aparelho rápido, cada letra ainda viraria uma
 * requisição. Aqui o que precisa ser economizado é rede, não CPU.
 *
 * 300 ms: abaixo disso, quem digita devagar no celular ainda dispara uma
 * busca no meio da palavra; acima, a resposta começa a parecer lenta.
 */
export function useDebouncedValue(value, delayMs = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);

    return debounced;
}
