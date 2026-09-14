import { useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import DateRangeFilter from '../../components/admin/DateRangeFilter';
import ExportButton from '../../components/admin/ExportButton';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import Skeleton from '../../components/feedback/Skeleton';
import { useAllRecruitmentProcesses } from '../../hooks/useRecruitmentProcess';
import { useCandidateSearch } from '../../hooks/useCandidate';
import { formatCnpj, formatCpf, formatDateTime, formatPhone, formatShortDate } from '../../lib/format';
import { API_URL, USE_MOCKS } from '../../services/config';

/**
 * Consulta de candidatos.
 *
 * ---------------------------------------------------------------------------
 * A ARMADILHA DAS DATAS — vale para qualquer filtro de período
 * ---------------------------------------------------------------------------
 * O `<input type="date">` devolve "2026-08-15". O backend espera um
 * LocalDateTime ("2026-08-15T00:00:00"). Se a data final for convertida com
 * T00:00:00, o filtro "até 15/08" descarta TODAS as inscrições do dia 15 —
 * porque 15/08 às 14h32 é maior que 15/08 às 00h00.
 *
 * O erro é silencioso: nada quebra, a lista só vem com menos gente do que
 * deveria, e ninguém percebe até faltar um candidato. Por isso o fim do
 * período vira 23:59:59.
 *
 * A busca só acontece no clique em "Buscar" (`enabled: false` no hook). Sem
 * isso a tela carregaria a lista inteira ao abrir, ignorando os filtros.
 */

/** "2026-08-15" -> "2026-08-15T00:00:00" (ou o fim do dia). */
const toDateTime = (date, edge) => {
    if (!date) return undefined;
    return edge === 'end' ? `${date}T23:59:59` : `${date}T00:00:00`;
};

const EXPORT_COLUMNS = [
    { header: 'Nome', value: (row) => row.name, width: 32 },
    { header: 'E-mail', value: (row) => row.email, width: 30 },
    { header: 'Telefone', value: (row) => formatPhone(row.phoneNumber), width: 18 },
    { header: 'CPF', value: (row) => formatCpf(row.cpf), width: 16 },
    { header: 'Razão social', value: (row) => row.companyName, width: 28 },
    { header: 'CNPJ', value: (row) => (row.cnpj ? formatCnpj(row.cnpj) : ''), width: 20 },
    { header: 'Cidade', value: (row) => row.city, width: 22 },
    { header: 'Estado', value: (row) => row.state, width: 8 },
    { header: 'Data da inscrição', value: (row) => formatDateTime(row.candidateDate), width: 20 },
    {
        header: 'Currículo',
        // O código antigo removia esta coluna da planilha. Ela volta como
        // ENDEREÇO COMPLETO: um caminho interno ("cv/ana.pdf") não serve para
        // nada em um Excel; um link abre o arquivo com um clique.
        value: (row) => (row.cv ? (USE_MOCKS ? row.cv.storedName : `${API_URL}/candidates/${row.id}/cv`) : ''),
        width: 40,
    },
];

export default function AdminCandidates() {
    const processesQuery = useAllRecruitmentProcesses();

    const [selectedProcessId, setSelectedProcessId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);

    // `appliedFilters` guarda o que foi realmente BUSCADO, separado do que está
    // digitado nos campos. Sem essa separação, mudar o select já refaria a
    // busca — e a chave do cache do React Query mudaria a cada tecla.
    const [appliedFilters, setAppliedFilters] = useState(null);

    const searchQuery = useCandidateSearch(appliedFilters ?? {}, {
        enabled: Boolean(appliedFilters),
    });

    const handleSearch = () => {
        if (!selectedProcessId) {
            setError('Selecione um processo seletivo para buscar os candidatos.');
            return;
        }
        if (startDate && endDate && startDate > endDate) {
            setError('A data inicial não pode ser depois da data final.');
            return;
        }

        setError(null);
        setAppliedFilters({
            recruitmentProcessId: selectedProcessId,
            startDate: toDateTime(startDate, 'start'),
            finalDate: toDateTime(endDate, 'end'),
        });
    };

    const processOptions = (processesQuery.data ?? []).map((process) => ({
        value: String(process.id),
        label: `${process.title}${process.active ? '' : ' (encerrado)'}`,
    }));

    const selectedProcess = processesQuery.data?.find(
        (process) => String(process.id) === String(appliedFilters?.recruitmentProcessId)
    );

    return (
        <AdminPage
            title="Candidatos"
            description="Escolha o processo seletivo e o período para ver quem se inscreveu."
        >
            <DateRangeFilter
                startLabel="Inscrições a partir de"
                endLabel="Inscrições até"
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onSubmit={handleSearch}
                isSearching={searchQuery.isFetching}
                error={error}
            >
                <Select
                    label="Processo seletivo"
                    required
                    value={selectedProcessId}
                    onChange={(event) => {
                        setSelectedProcessId(event.target.value);
                        setError(null);
                    }}
                    options={processOptions}
                    placeholder={
                        processesQuery.isPending
                            ? 'Carregando processos…'
                            : 'Selecione um processo seletivo'
                    }
                    disabled={processesQuery.isPending}
                />
            </DateRangeFilter>

            <div className="mt-6">
                {!appliedFilters && (
                    <EmptyState
                        icon={
                            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                        }
                        title="Escolha um processo e clique em Buscar"
                        description="A lista de candidatos aparece aqui depois da busca."
                    />
                )}

                {appliedFilters && searchQuery.isPending && (
                    <ul className="space-y-3">
                        {[0, 1, 2, 3].map((index) => (
                            <li key={index} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
                                <Skeleton className="h-5 w-56" />
                                <Skeleton className="mt-3 h-3 w-40" />
                                <Skeleton className="mt-2 h-3 w-32" />
                            </li>
                        ))}
                    </ul>
                )}

                {appliedFilters && searchQuery.isError && (
                    <ErrorState
                        title="Não foi possível buscar os candidatos"
                        error={searchQuery.error}
                        onRetry={() => searchQuery.refetch()}
                    />
                )}

                {appliedFilters && searchQuery.isSuccess && searchQuery.data.length === 0 && (
                    <EmptyState
                        title="Nenhuma inscrição neste período"
                        description={
                            selectedProcess
                                ? `Não há candidatos em "${selectedProcess.title}" dentro das datas escolhidas. Tente ampliar o período.`
                                : 'Tente ampliar o período da busca.'
                        }
                    />
                )}

                {appliedFilters && searchQuery.isSuccess && searchQuery.data.length > 0 && (
                    <>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted">
                                <strong className="text-ink-900">
                                    {searchQuery.data.length}
                                    {searchQuery.data.length === 1 ? ' candidato' : ' candidatos'}
                                </strong>
                                {selectedProcess && ` em "${selectedProcess.title}"`}
                            </p>

                            <ExportButton
                                rows={searchQuery.data}
                                columns={EXPORT_COLUMNS}
                                fileName="candidatos"
                                sheetName="Candidatos"
                            />
                        </div>

                        <ul className="mt-4 space-y-3">
                            {searchQuery.data.map((candidate) => (
                                <li
                                    key={candidate.id}
                                    className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-5"
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <h2 className="font-display text-base font-bold text-ink-900 sm:text-lg">
                                            {candidate.name}
                                        </h2>
                                        <span className="text-xs text-muted">
                                            {formatShortDate(candidate.candidateDate)}
                                        </span>
                                    </div>

                                    {/* Lista de definições: cada dado é um par
                                        rótulo + valor. No celular fica em uma
                                        coluna; no tablet, em duas. É o que
                                        substitui a tabela do código antigo, que
                                        tinha 9 colunas e não cabia em 360px. */}
                                    <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                                        <Field label="E-mail">
                                            <a href={`mailto:${candidate.email}`} className="break-all text-brand-700 hover:underline">
                                                {candidate.email}
                                            </a>
                                        </Field>
                                        <Field label="Telefone">
                                            <a href={`tel:${candidate.phoneNumber}`} className="text-brand-700 hover:underline">
                                                {formatPhone(candidate.phoneNumber)}
                                            </a>
                                        </Field>
                                        <Field label="CPF">{formatCpf(candidate.cpf)}</Field>
                                        <Field label="Cidade">
                                            {candidate.city} — {candidate.state}
                                        </Field>
                                        {candidate.companyName && (
                                            <Field label="Razão social">{candidate.companyName}</Field>
                                        )}
                                        {candidate.cnpj && <Field label="CNPJ">{formatCnpj(candidate.cnpj)}</Field>}
                                    </dl>

                                    {candidate.cv && (
                                        <a
                                            href={USE_MOCKS ? '#' : `${API_URL}/candidates/${candidate.id}/cv`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-50 px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100"
                                        >
                                            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                                <path d="M14 2v6h6M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            </svg>
                                            Abrir currículo
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </AdminPage>
    );
}

/** Um par rótulo + valor dentro do <dl>. */
function Field({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="text-ink-900">{children}</dd>
        </div>
    );
}
