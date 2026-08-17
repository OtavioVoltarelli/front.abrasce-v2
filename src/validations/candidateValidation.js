export function isValidCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;

    return remainder === parseInt(cleaned[10]);
}

export function isValidCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) return false;

    const calcDigit = (str, weights) =>
        weights.reduce((sum, w, i) => sum + parseInt(str[i]) * w, 0);

    const mod = (n) => {
        const r = n % 11;
        return r < 2 ? 0 : 11 - r;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    if (mod(calcDigit(cleaned, w1)) !== parseInt(cleaned[12])) return false;
    if (mod(calcDigit(cleaned, w2)) !== parseInt(cleaned[13])) return false;

    return true;
}

export function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateForm(formData) {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = 'Nome é obrigatório.';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email é obrigatório.';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Email inválido.';
    }

    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Telefone é obrigatório.';
    } else if (!isValidPhone(formData.phoneNumber)) {
        errors.phoneNumber = 'Telefone inválido. Use entre 10 e 11 dígitos.';
    }

    if (formData.cpf && !isValidCPF(formData.cpf)) {
        errors.cpf = 'CPF inválido.';
    }

    if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
        errors.cnpj = 'CNPJ inválido.';
    }

    if (!formData.city.trim()) {
        errors.city = 'Cidade é obrigatória.';
    }

    if (!formData.cvUrl) {
        errors.cvUrl = 'O envio do currículo é obrigatório.';
    }

    return errors;
}