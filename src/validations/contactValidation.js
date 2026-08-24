import { isValidEmail, isValidPhone } from './candidateValidation';

/**
 * Validação do formulário de contato.
 *
 * Espelha o `ContactInput` do backend v2: name, email, phoneNumber e message
 * são obrigatórios; city e state, não.
 */
export function validateContact(form) {
    const errors = {};

    if (!form.name?.trim()) errors.name = 'Informe seu nome.';

    if (!form.email?.trim()) {
        errors.email = 'Informe um e-mail para recebermos sua resposta.';
    } else if (!isValidEmail(form.email)) {
        errors.email = 'Confira o e-mail: falta o @ ou o domínio.';
    }

    if (!form.phoneNumber?.trim()) {
        errors.phoneNumber = 'Informe um telefone com DDD.';
    } else if (!isValidPhone(form.phoneNumber)) {
        errors.phoneNumber = 'Use 10 ou 11 dígitos, com DDD. Exemplo: (11) 98888-7777.';
    }

    if (!form.message?.trim()) {
        errors.message = 'Escreva sua mensagem.';
    } else if (form.message.trim().length < 10) {
        errors.message = 'Conte um pouco mais para conseguirmos ajudar.';
    }

    return errors;
}
