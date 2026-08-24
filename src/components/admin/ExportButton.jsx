import { useState } from 'react';
import Button from '../ui/Button';

/**
 * Exporta uma lista para uma planilha do Excel.
 *
 * ---------------------------------------------------------------------------
 * O DETALHE IMPORTANTE: A BIBLIOTECA É BAIXADA SÓ NO CLIQUE
 * ---------------------------------------------------------------------------
 * `await import('xlsx')` — com o `import` no meio da função, e não no topo do
 * arquivo — é um "import dinâmico". Ele diz ao Vite: separe a `xlsx` num
 * arquivo próprio e só baixe quando esta linha rodar.
 *
 * A `xlsx` tem cerca de 400 KB. Se ela estivesse importada no topo, TODA
 * pessoa que abrisse a tela de candidatos baixaria esses 400 KB — inclusive
 * quem só quer conferir quantas inscrições chegaram e nunca clica em exportar.
 * Assim, quem exporta paga; quem não exporta, não.
 *
 * O mesmo truque vale para qualquer biblioteca pesada usada em uma ação
 * pontual: editor de texto rico, leitor de PDF, gerador de gráfico.
 */
export default function ExportButton({ rows, columns, fileName, sheetName = 'Dados', disabled }) {
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const XLSX = await import('xlsx');

            // Monta as linhas com os CABEÇALHOS EM PORTUGUÊS e só as colunas
            // que interessam. Exportar o objeto cru levaria `cvUrl`,
            // `recruitmentProcessId` e outros campos internos para a planilha
            // que alguém vai abrir e ler.
            const data = rows.map((row) =>
                Object.fromEntries(
                    columns.map((column) => [column.header, column.value(row) ?? ''])
                )
            );

            const worksheet = XLSX.utils.json_to_sheet(data);

            // Largura das colunas: sem isto tudo sai com ~8 caracteres e a
            // pessoa precisa ajustar coluna por coluna ao abrir o arquivo.
            worksheet['!cols'] = columns.map((column) => ({ wch: column.width ?? 20 }));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            const today = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `${fileName}-${today}.xlsx`);
        } catch (exportError) {
            setError(exportError.message ?? 'Não foi possível gerar a planilha.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div>
            <Button
                variant="secondary"
                onClick={handleExport}
                disabled={disabled || isExporting || rows.length === 0}
                fullWidth
                className="sm:w-auto"
            >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
                {isExporting ? 'Gerando planilha…' : 'Exportar para Excel'}
            </Button>

            {error && (
                <p role="alert" className="mt-2 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}
