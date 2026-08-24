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

/** Telefone já completo, para EXIBIR numa listagem. */
export function formatPhone(value) {
    const digits = String(value ?? '').replace(/\D/g, '');
    if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return String(value ?? '');
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
    const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) return digits.replace(/(\d{1,2})/, '($1');
    if (digits.length <= 6) return digits.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    return digits.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
}

export function formatCpf(value) {
    const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatCnpj(value) {
    const digits = String(value ?? '').replace(/\D/g, '').slice(0, 14);
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

/** Extrai o nome legível de um caminho de arquivo vindo do backend. */
export function fileNameFromPath(path) {
    if (!path) return 'Anexo';
    return decodeURIComponent(String(path).split('/').pop());
}
