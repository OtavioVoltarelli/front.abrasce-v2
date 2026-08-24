import Input from '../ui/Input';
import Button from '../ui/Button';

/**
 * Filtro por intervalo de datas, usado nas telas de Candidatos e Contatos.
 *
 * Usa `<input type="date">` nativo de propósito. No celular ele abre o
 * seletor de data do próprio sistema — grande, com o dedo, no formato que a
 * pessoa já conhece, e traduzido. Qualquer calendário feito à mão em JavaScript
 * fica pior nos quatro pontos e ainda custa quilobytes.
 *
 * Os dois campos são OPCIONAIS: deixar em branco significa "sem limite
 * daquele lado". A dica abaixo dos campos explica isso, porque um campo de
 * data vazio parece um campo que falta preencher.
 */
export default function DateRangeFilter({
    startLabel,
    endLabel,
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    error,
    children,
    onSubmit,
    isSearching,
}) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-5"
        >
            <div className="space-y-4">
                {children}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        type="date"
                        label={startLabel}
                        value={startDate}
                        onChange={(event) => onStartChange(event.target.value)}
                        // `max` impede escolher um início posterior ao fim já
                        // preenchido: barrar antes é melhor que acusar depois.
                        max={endDate || undefined}
                    />
                    <Input
                        type="date"
                        label={endLabel}
                        value={endDate}
                        onChange={(event) => onEndChange(event.target.value)}
                        min={startDate || undefined}
                    />
                </div>

                <p className="text-xs text-muted">
                    Deixe uma data em branco para não limitar aquele lado do período.
                </p>

                {error && (
                    <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-red-700">
                        <span aria-hidden="true">⚠</span>
                        {error}
                    </p>
                )}

                <Button type="submit" size="lg" fullWidth className="sm:w-auto" disabled={isSearching}>
                    {isSearching ? 'Buscando…' : 'Buscar'}
                </Button>
            </div>
        </form>
    );
}
