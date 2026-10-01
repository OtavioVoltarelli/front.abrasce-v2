/**
 * Transforma endereços escritos no meio do texto em partes clicáveis.
 * ---------------------------------------------------------------------------
 * O texto da notícia e o do processo seletivo são TEXTO PURO vindos de um
 * formulário — não HTML. Quem escreve digita "inscrições em
 * https://prefeitura.gov.br/edital" e espera que vire um link.
 *
 * ---------------------------------------------------------------------------
 * POR QUE ISSO NÃO É `dangerouslySetInnerHTML`
 * ---------------------------------------------------------------------------
 * A solução preguiçosa seria trocar a URL por `<a href="...">` numa string e
 * jogar no `dangerouslySetInnerHTML`. Isso abre um XSS (cross-site scripting:
 * código de fora rodando no navegador de quem visita o site): bastaria alguém
 * digitar `<img src=x onerror=alert(1)>` no texto da notícia para o navegador
 * executar aquilo.
 *
 * Este arquivo não gera HTML. Ele PARTE o texto numa lista de pedaços
 * — `{ type: 'text' }` e `{ type: 'link' }` — e o React monta os elementos.
 * Texto continua sendo texto, e o React escapa tudo sozinho.
 *
 * ---------------------------------------------------------------------------
 * LISTA DE PERMISSÃO, NÃO LISTA DE PROIBIÇÃO
 * ---------------------------------------------------------------------------
 * `javascript:alert(document.cookie)` é um endereço válido para o navegador, e
 * um `<a href>` com ele executa o código ao ser clicado. Bloquear "os esquemas
 * perigosos" é uma corrida perdida — sempre falta um.
 *
 * Aqui só três esquemas passam: http, https e mailto. Qualquer outra coisa é
 * devolvida como TEXTO comum, visível e inofensiva.
 *
 * O painel exige login, mas isso não torna o texto confiável: ele continua
 * sendo digitado (ou colado de um e-mail, de um PDF) por uma pessoa, e basta
 * uma senha vazada para alguém mal-intencionado escrever uma notícia. Todo
 * texto que não foi escrito no código-fonte é conteúdo NÃO CONFIÁVEL, e é
 * assim que ele é tratado aqui.
 */

/**
 * O que conta como endereço:
 *   https://… ou http://…   esquema explícito
 *   www.algo.com            o jeito que as pessoas realmente digitam
 *   nome@dominio.com        vira mailto:
 *
 * `[^\s<>"']+` para de propósito no primeiro espaço ou sinal de marcação: uma
 * URL não tem espaço, e não deixar `<` e `>` entrarem evita que um pedaço de
 * marcação seja arrastado para dentro do href.
 *
 * Domínio "solto" (`prefeitura.gov.br`, sem www e sem esquema) NÃO é detectado.
 * Seria simpático e daria falso positivo em coisas como "conforme o art.
 * 5º.Parágrafo" — e um link errado no meio do texto é pior que um link
 * faltando, porque o leitor clica e vai parar em lugar nenhum.
 */
const LINK_PATTERN =
    /(?:https?:\/\/|www\.)[^\s<>"']+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/gi;

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

/**
 * Devolve a pontuação que veio grudada no fim do endereço.
 *
 * "Veja em https://site.gov.br/edital." — o ponto é da FRASE, não da URL.
 * Sem isto o link levaria a um endereço com um ponto sobrando no fim.
 *
 * O parêntese tem uma regra própria: em "(https://site.com/a)" o fecha-
 * parêntese é da frase, mas em "https://pt.wikipedia.org/wiki/Sol_(estrela)"
 * ele faz parte do endereço. A conta é simples: só é da frase se houver mais
 * fechados do que abertos dentro do que foi capturado.
 */
const SENTENCE_PUNCTUATION = '.,;:!?]}\'"»>';

function splitTrailingPunctuation(raw) {
    let url = raw;
    let trailing = '';

    while (url.length > 1) {
        const last = url.at(-1);

        if (last === ')') {
            const opens = (url.match(/\(/g) ?? []).length;
            const closes = (url.match(/\)/g) ?? []).length;
            if (closes <= opens) break;
        } else if (!SENTENCE_PUNCTUATION.includes(last)) {
            break;
        }

        trailing = last + trailing;
        url = url.slice(0, -1);
    }

    return [url, trailing];
}

/**
 * Endereço seguro para o `href`, ou `null` se não for confiável.
 * `null` é o sinal para renderizar como texto comum.
 */
export function safeHref(raw) {
    const isEmail = !raw.includes('://') && raw.includes('@');

    const candidate = isEmail
        ? `mailto:${raw}`
        // "www.algo.com" sem esquema: assume https, que é o padrão hoje e o
        // que qualquer navegador tentaria primeiro.
        : /^https?:\/\//i.test(raw)
            ? raw
            : `https://${raw}`;

    try {
        const url = new URL(candidate);
        return ALLOWED_PROTOCOLS.has(url.protocol) ? url.href : null;
    } catch {
        // URL malformada. Não é erro do programa — é alguém que digitou torto.
        return null;
    }
}

/**
 * O texto que aparece na tela.
 *
 * Endereços longos são um problema REAL no celular: uma URL de 120 caracteres
 * é uma "palavra" só e, sem tratamento, empurra a largura da página e cria a
 * barra de rolagem horizontal que este projeto não admite.
 *
 * Duas medidas, e as duas são necessárias:
 *   · aqui, encurtar o texto visível;
 *   · no componente, `break-words`, para o que sobrar quebrar entre linhas.
 *
 * O ENCURTAMENTO NUNCA ESCONDE O DOMÍNIO. É o domínio que diz para onde o
 * clique leva, e é por ele que a pessoa decide se confia. O que some é o miolo
 * do caminho; o fim é preservado porque costuma ser o nome do arquivo
 * ("edital-2026.pdf"), que é o que identifica o destino.
 */
const MAX_LABEL = 44;

export function linkLabel(raw, href) {
    if (href?.startsWith('mailto:')) return raw;

    try {
        const url = new URL(href);
        const host = url.hostname.replace(/^www\./i, '');
        const path = `${url.pathname}${url.search}${url.hash}`;
        const tail = path === '/' ? '' : path;
        const full = host + tail;

        if (full.length <= MAX_LABEL) return full;

        const tailLength = Math.max(10, MAX_LABEL - host.length - 1);
        return `${host}…${tail.slice(-tailLength)}`;
    } catch {
        return raw;
    }
}

/**
 * Parte uma linha de texto em pedaços de texto e de link.
 *
 * Devolve sempre uma lista — uma linha sem nenhum endereço vira um pedaço só.
 * Quem chama não precisa saber se havia link ou não.
 */
export function splitLinks(line) {
    const parts = [];
    let lastIndex = 0;

    // `matchAll` com a flag /g percorre todas as ocorrências. É por isso que
    // "mais de uma URL na mesma notícia" funciona sem nenhum tratamento extra.
    for (const match of line.matchAll(LINK_PATTERN)) {
        const [candidate] = match;
        const [url, trailing] = splitTrailingPunctuation(candidate);
        const href = safeHref(url);

        if (match.index > lastIndex) {
            parts.push({ type: 'text', value: line.slice(lastIndex, match.index) });
        }

        if (href) {
            parts.push({ type: 'link', value: url, href, label: linkLabel(url, href) });
        } else {
            // Esquema não permitido ou endereço quebrado: volta a ser texto.
            parts.push({ type: 'text', value: url });
        }

        if (trailing) parts.push({ type: 'text', value: trailing });

        lastIndex = match.index + candidate.length;
    }

    if (lastIndex < line.length) {
        parts.push({ type: 'text', value: line.slice(lastIndex) });
    }

    return parts;
}
