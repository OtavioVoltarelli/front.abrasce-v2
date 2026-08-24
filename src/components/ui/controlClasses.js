import { cn } from '../../lib/cn';

/**
 * Classes visuais de um controle de formulário (input, textarea, select).
 *
 * Mora num arquivo separado do `Field.jsx` por um motivo de ferramenta: o
 * "fast refresh" do Vite — aquilo que atualiza a tela sem recarregar a página
 * quando você salva — só consegue preservar o estado do componente se o
 * arquivo exportar SÓ componentes. Um arquivo que exporta um componente E uma
 * função obriga o Vite a recarregar tudo, e você perde o que já tinha digitado
 * no formulário. Foi exatamente isso que a regra `react-refresh/only-export-components`
 * apontou.
 *
 * As três aparências ficam aqui juntas para input, textarea e select usarem
 * exatamente as mesmas — três aparências ligeiramente diferentes para
 * campos da mesma linha é o tipo de coisa que ninguém nota conscientemente,
 * mas que faz o formulário parecer malfeito.
 *
 * `text-base` (16px) NÃO é escolha estética: o Safari do iPhone dá zoom
 * automático em qualquer campo com fonte menor que 16px assim que ele recebe
 * foco — a página inteira salta e a pessoa precisa fechar o zoom na mão.
 */
export const controlClasses = (invalid) =>
    cn(
        'w-full rounded-xl bg-white px-4 py-3 text-base text-ink-900',
        'min-h-12 ring-1 ring-inset transition-shadow',
        'placeholder:text-muted/70',
        'disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted',
        invalid
            ? 'ring-red-500 focus:ring-2 focus:ring-red-600'
            : 'ring-line hover:ring-brand-300 focus:ring-2 focus:ring-brand-600'
    );
