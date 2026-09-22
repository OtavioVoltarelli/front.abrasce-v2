/**
 * Leitura do prazo de validade de um JWT, SÓ NO NAVEGADOR — sem verificar
 * assinatura. Isso é intencional e suficiente para o que este arquivo resolve:
 * quem garante que o token é de verdade é o backend, a cada requisição
 * (`SecurityConfig.java`); aqui a pergunta é outra — "esse token que já está
 * salvo ainda tem prazo, ou é só lixo de uma sessão vencida?" — e essa
 * pergunta não precisa de assinatura pra ser respondida, só da parte pública
 * do token (o "payload", que qualquer um pode ler, não só o backend).
 *
 * ---------------------------------------------------------------------------
 * O BUG QUE ISTO RESOLVE
 * ---------------------------------------------------------------------------
 * Sem isto, `isAuthenticated` só perguntava "existe algo salvo no
 * localStorage?" — não "esse token ainda vale?". Um token vencido (o backend
 * expira em 8h) continuava contando como "logado" até a PRIMEIRA chamada de
 * API voltar 401, o que é assíncrono: a tela do admin chegava a desenhar por
 * um instante antes do redirecionamento pro login. Checar o prazo aqui, no
 * mesmo render síncrono que decide `isAuthenticated`, fecha essa janela.
 */

/** Decodifica a parte do meio de um JWT (`header.payload.assinatura`) e
 *  devolve o objeto — ou `null` se o token estiver corrompido ou não for
 *  um JWT de verdade. Base64URL usa `-`/`_` em vez de `+`/`/`, e por isso
 *  `atob` sozinho não dá: precisa trocar os caracteres antes. */
function decodeJwtPayload(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

/** `exp` do JWT é em segundos desde a época; `Date.now()` é em milissegundos.
 *  Token sem `exp` ou ilegível é tratado como vencido — mais seguro assumir
 *  que não vale do que assumir que vale para sempre. */
export function isTokenExpired(token) {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
}
