/**
 * A paleta do site — FONTE ÚNICA DE VERDADE das cores de acento.
 * ---------------------------------------------------------------------------
 * O site inteiro trabalha com SETE matizes: o azul da marca e as seis cores
 * das áreas de atuação. Nunca uma oitava. Essa restrição é o que separa
 * "colorido" de "bagunçado": a variedade vem de usar as mesmas sete cores em
 * lugares diferentes, não de inventar uma cor nova a cada tela.
 *
 * Cada matiz tem QUATRO papéis, e cada papel só serve para uma coisa:
 *
 *   color -> a cor cheia. Preenche formas: faixas, pontos, ícones, barras.
 *            NÃO use para texto sobre branco — várias delas não passam no
 *            contraste mínimo.
 *   ink   -> a versão escurecida. A ÚNICA aprovada para TEXTO sobre branco
 *            ou sobre o `tint`. Todas passam de 4.5:1 (mínimo da WCAG AA).
 *   tint  -> a versão bem clara. Fundo de etiqueta, de card e de seção.
 *   deep  -> a versão bem escura. Existe só para o degradê dos cabeçalhos
 *            escuros: sendo escura o bastante, o texto branco continua
 *            legível em cima dela.
 *   bright-> a versão clara. O espelho do `ink`: é a única aprovada para
 *            TEXTO SOBRE O FUNDO ESCURO. Todas passam de 8:1 no azul-marinho.
 *
 * POR QUE ISSO MORA EM JAVASCRIPT E NÃO SÓ EM CLASSES DO TAILWIND
 * O Tailwind lê o código-fonte procurando classes escritas por extenso. Uma
 * classe montada em tempo de execução (`bg-${cor}-100`) nunca é encontrada e
 * simplesmente não existe no CSS final. Quando a cor só é conhecida em tempo
 * de execução — o cabeçalho de uma página, o card de uma área — o componente
 * injeta a cor como VARIÁVEL CSS pelo `style` e usa `bg-[var(--accent)]`, que
 * é uma string literal no código-fonte e portanto é encontrada.
 *
 * As mesmas cores também estão em `styles/theme.css` como tokens do Tailwind
 * (`bg-leaf-tint`, `text-coral-ink`...). Use os tokens quando a cor for
 * conhecida na hora de escrever o código; use as variáveis quando não for.
 */

export const PALETTE = {
    brand:  { color: '#2B4BE0', ink: '#1E309E', tint: '#EEF2FF', deep: '#141C4B', bright: '#9DB0FF' },
    lagoon: { color: '#0E9AA7', ink: '#0E7490', tint: '#ECFEFF', deep: '#0A3C46', bright: '#67E8F9' },
    sun:    { color: '#F59E0B', ink: '#B45309', tint: '#FFFBEB', deep: '#432A06', bright: '#FCD34D' },
    berry:  { color: '#E14B5A', ink: '#BE123C', tint: '#FFF1F2', deep: '#4A1024', bright: '#FDA4AF' },
    iris:   { color: '#8B5CF6', ink: '#6D28D9', tint: '#F5F3FF', deep: '#2E1065', bright: '#C4B5FD' },
    leaf:   { color: '#16A34A', ink: '#15803D', tint: '#F0FDF4', deep: '#0A3A21', bright: '#86EFAC' },
    coral:  { color: '#FF6B4A', ink: '#C2410C', tint: '#FFF3EE', deep: '#481709', bright: '#FDBA9B' },
};

/**
 * Transforma um nome de acento nas quatro variáveis CSS que os componentes
 * consomem. Um acento desconhecido cai no azul da marca em vez de deixar a
 * variável vazia — uma cor errada é um bug visível, uma variável vazia é um
 * elemento invisível.
 */
export function accentVars(name) {
    const accent = PALETTE[name] ?? PALETTE.brand;
    return {
        '--accent': accent.color,
        '--accent-ink': accent.ink,
        '--accent-tint': accent.tint,
        '--accent-deep': accent.deep,
        '--accent-bright': accent.bright,
    };
}
