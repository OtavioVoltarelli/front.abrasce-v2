/**
 * Validação do formulário de candidatura.
 *
 * Roda no navegador para dar resposta imediata — mas NÃO substitui a validação
 * do backend. Validação no front é conveniência para quem preenche; validação
 * no servidor é segurança. Qualquer pessoa consegue enviar dados direto para a
 * API sem passar por esta tela.
 *
 * As regras espelham as anotações do `CandidateInput` do backend v2:
 * name, email, phoneNumber, cpf, state e city são @NotBlank;
 * companyName e cnpj são opcionais.
 */

import { MAX_FILE_SIZE_MB, exceedsMaxSize, hasAllowedExtension } from '../lib/uploadRules';

export function isValidCPF(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

    // Dígito verificador: soma ponderada dos 9 primeiros, resto por 11.
    const check = (length) => {
        let sum = 0;
        for (let i = 0; i < length; i += 1) sum += Number(digits[i]) * (length + 1 - i);
        const remainder = (sum * 10) % 11;
        return remainder === 10 || remainder === 11 ? 0 : remainder;
    };

    return check(9) === Number(digits[9]) && check(10) === Number(digits[10]);
}

export function isValidCNPJ(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;

    const digitFor = (weights) => {
        const sum = weights.reduce((total, weight, index) => total + Number(digits[index]) * weight, 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    return digitFor(firstWeights) === Number(digits[12]) && digitFor(secondWeights) === Number(digits[13]);
}

export function isValidPhone(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
}

export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? '').trim());
}

/**
 * Devolve um objeto `{ campo: mensagem }`, vazio quando está tudo certo.
 *
 * As mensagens dizem O QUE FAZER, não só o que está errado: "Use 10 ou 11
 * dígitos, com DDD" resolve; "Telefone inválido" deixa a pessoa adivinhando.
 */
export function validateCandidate(form) {
    const errors = {};

    if (!form.name?.trim()) {
        errors.name = 'Informe seu nome completo.';
    } else if (form.name.trim().length > 255) {
        errors.name = 'O nome pode ter no máximo 255 caracteres.';
    }

    if (!form.email?.trim()) {
        errors.email = 'Informe um e-mail para a ABRASCE entrar em contato.';
    } else if (!isValidEmail(form.email)) {
        errors.email = 'Confira o e-mail: falta o @ ou o domínio.';
    }

    if (!form.phoneNumber?.trim()) {
        errors.phoneNumber = 'Informe um telefone com DDD.';
    } else if (!isValidPhone(form.phoneNumber)) {
        errors.phoneNumber = 'Use 10 ou 11 dígitos, com DDD. Exemplo: (11) 98888-7777.';
    }

    if (!form.cpf?.trim()) {
        errors.cpf = 'Informe seu CPF.';
    } else if (!isValidCPF(form.cpf)) {
        errors.cpf = 'Este CPF não é válido. Confira os números digitados.';
    }

    // Opcionais: só validam se a pessoa preencheu.
    if (form.cnpj?.trim() && !isValidCNPJ(form.cnpj)) {
        errors.cnpj = 'Este CNPJ não é válido. Confira os números digitados.';
    }

    if (!form.state) errors.state = 'Selecione o estado.';
    if (!form.city?.trim()) errors.city = 'Informe a cidade onde você mora.';

    if (!form.cv) {
        errors.cv = 'Anexe seu currículo para concluir a inscrição.';
    } else if (exceedsMaxSize('cv', form.cv)) {
        errors.cv = `O arquivo passa de ${MAX_FILE_SIZE_MB.cv} MB. Tente salvar o currículo em PDF, que costuma ficar menor.`;
    } else if (!hasAllowedExtension('cv', form.cv.name)) {
        // Pela EXTENSÃO, como o backend decide — não pelo tipo MIME. O MIME
        // vem do sistema operacional e varia: no Android um .odt costuma
        // chegar vazio ou como application/octet-stream.
        errors.cv = 'Envie o currículo em PDF ou Word.';
    }

    return errors;
}
