import { formatFileSize } from '../lib/format';
import {
    FORMATS_LABEL,
    MAX_FILE_SIZE_MB,
    MAX_REQUEST_SIZE_MB,
    exceedsMaxSize,
    exceedsRequestSize,
    hasAllowedExtension,
} from '../lib/uploadRules';

/**
 * Validação de uma lista de anexos (notícia, processo seletivo).
 *
 * Devolve UMA mensagem — a do problema que a pessoa precisa resolver primeiro —
 * ou `null`. Arquivo grande demais vem antes da soma: tirar o arquivo de 30 MB
 * costuma resolver a soma junto, e pedir as duas coisas de uma vez confunde.
 *
 * O backend recusa os dois casos com 413 de qualquer jeito; validar aqui evita
 * a pessoa esperar o upload inteiro (no 4G, minutos) para só então saber.
 */
export function validateAttachments(category, files) {
    if (!files?.length) return null;

    // Tipo primeiro: um arquivo que o servidor nunca aceitaria não adianta
    // diminuir. O `accept` do seletor não garante isso — no Android ele
    // costuma ser ignorado, e o envio inteiro voltava 400 depois do upload.
    const notAllowed = files.filter((file) => !hasAllowedExtension(category, file.name));
    if (notAllowed.length > 0) {
        const names = notAllowed.map((file) => `“${file.name}”`).join(', ');
        return `${names} não ${notAllowed.length === 1 ? 'é um tipo aceito' : 'são tipos aceitos'}. Envie: ${FORMATS_LABEL[category]}.`;
    }

    const maxMb = MAX_FILE_SIZE_MB[category];
    const oversized = files.filter((file) => exceedsMaxSize(category, file));

    if (oversized.length === 1) {
        return `“${oversized[0].name}” passa de ${maxMb} MB. Remova o arquivo ou envie uma versão menor.`;
    }
    if (oversized.length > 1) {
        return `${oversized.length} arquivos passam de ${maxMb} MB. Remova-os ou envie versões menores.`;
    }

    if (exceedsRequestSize(files)) {
        const total = files.reduce((sum, file) => sum + file.size, 0);
        return `Os anexos somam ${formatFileSize(total)}, e o máximo por envio é ${MAX_REQUEST_SIZE_MB} MB. Remova algum arquivo.`;
    }

    return null;
}
