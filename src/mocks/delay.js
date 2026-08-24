/**
 * Atraso artificial dos mocks.
 *
 * Sem isso, os dados chegam no mesmo instante e o estado de "carregando"
 * nunca aparece na tela — você não consegue ver se ele está bonito ou se
 * a tela "pula" quando o conteúdo entra. Um mock instantâneo esconde
 * exatamente o problema que mais incomoda em celular com internet ruim.
 */
export const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simula uma falha de rede. Útil para testar a tela de erro:
 * troque `delay(600)` por `failSometimes(1)` dentro de um mock.
 */
export const failSometimes = (probability = 0.3) =>
    delay(600).then(() => {
        if (Math.random() < probability) {
            throw new Error('Não foi possível carregar os dados. Verifique sua conexão.');
        }
    });
