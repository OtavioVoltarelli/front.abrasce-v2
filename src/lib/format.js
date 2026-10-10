/**
 * Formatação de dados para exibição.
 *
 * Fica isolado aqui, e não dentro dos componentes, por dois motivos:
 * a mesma data aparece em 5 telas (tem que ser idêntica nas 5), e assim dá
 * para corrigir o formato em um lugar só.
 */

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

/**
 * O backend manda LocalDateTime como "2026-03-14T10:30:00" — sem fuso.
 * `new Date()` nessa string a interpreta como horário LOCAL do navegador,
 * que é o que queremos (o backend já grava em America/Sao_Paulo).
 */
function toDate(value) {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
    const date = toDate(value);
    return date ? DATE_FORMATTER.format(date) : '—';
}

export function formatShortDate(value) {
    const date = toDate(value);
    return date ? SHORT_DATE_FORMATTER.format(date) : '—';
}

export function formatDateTime(value) {
    const date = toDate(value);
    return date ? DATE_TIME_FORMATTER.format(date) : '—';
}

/** Valor para o atributo `datetime` do <time>: o formato que máquinas leem. */
export function toIsoDate(value) {
    const date = toDate(value);
    return date ? date.toISOString() : undefined;
}

/** Só os dígitos de um texto — o formato em que CPF, CNPJ e telefone vão
 *  para o backend e voltam dele. A máscara é só da tela. */
export const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '');

/*
 * EXIBIR vs. DIGITAR
 * `formatPhone`, `formatCpf` e `formatCnpj` mostram um valor que já chegou do
 * backend (listagem, detalhe, planilha): mascaram só quando o tamanho bate e,
 * fora do padrão, devolvem os dígitos crus — os dados migrados da v1 têm
 * telefone com 9, 12 e 13 dígitos, e uma máscara aplicada pela metade
 * ("(11) 9888") esconderia o problema em vez de mostrá-lo.
 * `maskPhone`, `maskCpf` e `maskCnpj` acompanham a DIGITAÇÃO, montando a
 * máscara aos poucos.
 * Valor vazio vira '' em todas: quem exibe decide se mostra "—".
 */

/** Telefone para EXIBIR: 11 dígitos → (99) 99999-9999; 10 → (99) 9999-9999. */
export function formatPhone(value) {
    const digits = onlyDigits(value);
    if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return digits;
}

/** CPF para EXIBIR: 11 dígitos → 999.999.999-99. */
export function formatCpf(value) {
    const digits = onlyDigits(value);
    if (digits.length === 11) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return digits;
}

/**
 * CNPJ para EXIBIR: 14 dígitos → 99.999.999/9999-99. Com 11, é um CPF — na v1
 * muita gente pôs o CPF no campo de CNPJ —, e sai com a máscara de CPF.
 */
export function formatCnpj(value) {
    const digits = onlyDigits(value);
    if (digits.length === 14) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    if (digits.length === 11) return formatCpf(digits);
    return digits;
}

/**
 * Telefone sendo DIGITADO — a máscara se monta aos poucos.
 *
 * Diferença que importa: `formatPhone` só aplica a máscara quando o número
 * está completo, então o campo fica "1198888" cru e, na última tecla, salta
 * para "(11) 98888-7777". Esse salto assusta e atrapalha a conferência.
 * Aqui o parêntese aparece no 1º dígito, fecha no 3º e o hífen entra na hora
 * certa — o número toma forma junto com a digitação.
 *
 * O limite de 11 dígitos é aplicado aqui, e não só pelo maxLength do campo:
 * `maxLength` conta CARACTERES (incluindo os parênteses e o hífen), o que
 * daria uma conta diferente da que queremos.
 */
export function maskPhone(value) {
    const digits = onlyDigits(value).slice(0, 11);

    if (digits.length <= 2) return digits.replace(/(\d{1,2})/, '($1');
    if (digits.length <= 6) return digits.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    return digits.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
}

/** CPF sendo DIGITADO — a máscara se monta aos poucos. */
export function maskCpf(value) {
    const digits = onlyDigits(value).slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/** CNPJ sendo DIGITADO — a máscara se monta aos poucos. */
export function maskCnpj(value) {
    const digits = onlyDigits(value).slice(0, 14);
    return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
