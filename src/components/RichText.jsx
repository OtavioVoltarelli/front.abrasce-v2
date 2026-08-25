import { splitLinks } from '../lib/autolink';

/**
 * Renderiza o texto longo vindo do backend.
 *
 * Os campos `longDescription` (notícia) e `description` (processo seletivo)
 * são texto puro com quebras de linha — não HTML. O site antigo os jogava
 * dentro de um <pre>, o que herda fonte monoespaçada e, pior, NÃO quebra
 * linha: um parágrafo comprido virava uma linha só com barra de rolagem
 * horizontal. Em celular era ilegível.
 *
 * Aqui cada bloco separado por linha em branco vira um <p> de verdade, com o
 * espaçamento e a largura de leitura da tipografia do site.
 *
 * ---------------------------------------------------------------------------
 * ENDEREÇOS VIRAM LINKS
 * ---------------------------------------------------------------------------
 * Quem escreve a notícia digita "inscrições em https://prefeitura.gov.br/edital"
 * e espera que aquilo seja clicável. Quantos endereços houver no texto, todos
 * viram link — não há limite de um por notícia.
 *
 * Nada de `dangerouslySetInnerHTML`: o conteúdo vem de um formulário, e injetar
 * HTML de fonte externa é uma porta de entrada para XSS (código de fora rodando
 * no navegador de quem visita). `splitLinks` PARTE o texto numa lista de
 * pedaços e o React monta os elementos — texto continua sendo texto, e o React
 * escapa tudo sozinho. A validação do endereço mora em `lib/autolink.js`.
 */
export default function RichText({ text, className = '' }) {
    if (!text?.trim()) return null;

    const paragraphs = text.split(/\n{2,}/).filter((block) => block.trim());

    return (
        <div className={`prose-abrasce ${className}`}>
            {paragraphs.map((paragraph, index) => (
                // A ordem dos parágrafos nunca muda, então o índice é uma chave
                // segura aqui — diferente de uma lista que dá para reordenar.
                <p key={index}>
                    {paragraph.split('\n').map((line, lineIndex, lines) => (
                        <span key={lineIndex}>
                            {splitLinks(line).map((part, partIndex) => {
                                if (part.type !== 'link') return part.value;

                                /* `mailto:` NÃO abre aba nova. Ele entrega o
                                   endereço ao aplicativo de e-mail, e com
                                   target="_blank" o navegador ainda abre uma
                                   aba em branco que fica lá, órfã, depois que o
                                   aplicativo assume. Mesma regra do componente
                                   Button — a decisão vale para o site inteiro. */
                                const opensInApp = part.href.startsWith('mailto:');

                                return (
                                    <a
                                        key={partIndex}
                                        href={part.href}
                                        target={opensInApp ? undefined : '_blank'}
                                        /* `noreferrer` impede que o site de
                                           destino saiba de onde o clique veio e,
                                           mais importante, corta o acesso da
                                           aba nova à aba de origem. */
                                        rel={opensInApp ? undefined : 'noreferrer'}
                                        /* A quebra de endereços longos NÃO fica
                                           aqui: mora em `.prose-abrasce a`, no
                                           theme.css, que é mais específico e
                                           venceria esta classe de qualquer
                                           jeito. Uma propriedade declarada em
                                           dois lugares, com um deles sem efeito,
                                           é a receita para alguém "consertar" o
                                           lugar errado daqui a seis meses. */
                                    >
                                        {part.label}
                                        {/* Só para leitor de tela: quem enxerga
                                            percebe a aba nova; quem não enxerga
                                            precisa ser avisado ANTES de clicar. */}
                                        {!opensInApp && (
                                            <span className="sr-only"> (abre em nova aba)</span>
                                        )}
                                    </a>
                                );
                            })}
                            {lineIndex < lines.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            ))}
        </div>
    );
}
