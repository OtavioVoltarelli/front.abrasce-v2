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
 * Nada de `dangerouslySetInnerHTML`: o conteúdo vem de um formulário de
 * administração, e injetar HTML de uma fonte externa é uma porta de entrada
 * para XSS (script malicioso rodando no navegador de quem visita).
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
                            {line}
                            {lineIndex < lines.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            ))}
        </div>
    );
}
