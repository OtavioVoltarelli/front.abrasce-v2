/**
 * Rola a tela até o PRIMEIRO campo inválido depois de uma validação que falhou.
 *
 * "Primeiro" é decidido pela ORDEM VISUAL do formulário (`fieldOrder`), não pela
 * ordem das chaves no objeto de erros — as duas costumam coincidir, mas contar
 * com isso implicitamente quebraria silenciosamente se alguém reordenasse os
 * campos na tela sem lembrar de reordenar a validação também.
 *
 * Sem isto, um formulário longo no celular podia mostrar "Não foi possível
 * salvar" com o único campo errado três telas acima da dobra — a pessoa via
 * a mensagem, não via ONDE agir, e às vezes reenviava o formulário inteiro de
 * novo sem mudar nada.
 */
export function scrollToFirstError(fieldOrder, errors) {
    const firstInvalidId = fieldOrder.find((id) => errors[id]);
    if (!firstInvalidId) return;

    const field = document.getElementById(firstInvalidId);
    if (!field) return;

    field.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Um Input/Textarea/Select é focável direto; o MediaField é um <div> de
    // agrupamento — quem recebe o foco de verdade é o botão de dentro dele.
    const focusTarget = field.matches('input, textarea, select')
        ? field
        : field.querySelector('button, input, textarea, select');
    focusTarget?.focus({ preventScroll: true });
}
