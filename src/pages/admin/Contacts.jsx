import { useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import DateRangeFilter from '../../components/admin/DateRangeFilter';
import ExportButton from '../../components/admin/ExportButton';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorState from '../../components/feedback/ErrorState';
import Skeleton from '../../components/feedback/Skeleton';
import LoadMore from '../../components/feedback/LoadMore';
import { fetchAllContacts, useContactSearch } from '../../hooks/useContact';
import { formatDateTime, formatPhone, formatShortDate } from '../../lib/format';

/**
 * Consulta das mensagens de contato.
 *
 * ---------------------------------------------------------------------------
 * A REGRA DO BRIEFING: VER A MENSAGEM SEM NOVA REQUISIÇÃO
 * ---------------------------------------------------------------------------
 * A mensagem completa JÁ VEIO na busca — `ContactOutput` traz o campo
 * `message` inteiro. Então "Ver mensagem completa" não busca nada: só guarda
 * no estado qual contato abrir e o modal lê o texto que já está na memória.
 *
 * Isso é o oposto do reflexo comum ("abrir detalhe = buscar detalhe"). Aqui,
 * buscar de novo seria uma espera inventada para exibir um dado que já está
 * na tela.
 *
 * Na lista, a mensagem aparece cortada em três linhas (`clamp-3`). Sem isso,
 * uma mensagem de seis parágrafos ocuparia a tela inteira e as outras
 * mensagens ficariam invisíveis.
 *
 * ---------------------------------------------------------------------------
 * A ARMADILHA DAS DATAS — mesma regra de `admin/Candidates.jsx`
 * ---------------------------------------------------------------------------
 * O `<input type="date">` devolve "2026-08-15"; o backend espera um
 * LocalDateTime ("2026-08-15T00:00:00"). Se a data final virasse T00:00:00,
 * o filtro "até 15/08" descartaria todo o dia 15 — por isso o fim do período
 * vira 23:59:59.
 */

/** "2026-08-15" -> "2026-08-15T00:00:00" (ou o fim do dia). */
const toDateTime = (date, edge) => {
    if (!date) return undefined;
    return edge === 'end' ? `${date}T23:59:59` : `${date}T00:00:00`;
};

const EXPORT_COLUMNS = [
    { header: 'Nome', value: (row) => row.name, width: 30 },
    { header: 'E-mail', value: (row) => row.email, width: 30 },
    { header: 'Telefone', value: (row) => formatPhone(row.phoneNumber), width: 18 },
    { header: 'Cidade', value: (row) => row.city, width: 22 },
    { header: 'Estado', value: (row) => row.state, width: 8 },
    { header: 'Data', value: (row) => formatDateTime(row.creationDate), width: 20 },
    { header: 'Mensagem', value: (row) => row.message, width: 80 },
];

export default function AdminContacts() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const [openContact, setOpenContact] = useState(null);

    // `appliedFilters` guarda o que foi realmente BUSCADO, separado do que
    // está digitado nos campos — mesma separação de `admin/Candidates.jsx`.
    const [appliedFilters, setAppliedFilters] = useState(null);

    const query = useContactSearch(appliedFilters ?? {}, {
        enabled: Boolean(appliedFilters),
    });

    // Mais recente primeiro já vem do backend (ordem padrão do
    // `ContactController`). Reordenar aqui só valeria para as páginas já
    // carregadas e embaralharia a lista a cada "Carregar mais".
    const results = query.data ?? [];

    const handleSearch = () => {
        if (startDate && endDate && startDate > endDate) {
            setError('A data inicial não pode ser depois da data final.');
            return;
        }
        setError(null);
        setAppliedFilters({
            startDate: toDateTime(startDate, 'start'),
            finalDate: toDateTime(endDate, 'end'),
        });
    };

    return (
        <AdminPage
            title="Contatos"
            description="Mensagens enviadas pelo formulário de contato do site."
        >
            <DateRangeFilter
                startLabel="Contatos a partir de"
                endLabel="Contatos até"
                startDate={startDate}
                endDate={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                onSubmit={handleSearch}
                isSearching={query.isFetching}
                error={error}
            />

            <div className="mt-6">
                {!appliedFilters && (
                    <EmptyState
                        icon={
                            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="m3 7 9 6 9-6" />
                            </svg>
                        }
                        title="Clique em Buscar para ver as mensagens"
                        description="Deixe as duas datas em branco para trazer todos os contatos já recebidos."
                    />
                )}

                {appliedFilters && query.isPending && (
                    <ul className="space-y-3">
                        {[0, 1, 2].map((index) => (
                            <li key={index} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="mt-3 h-3 w-36" />
                                <Skeleton className="mt-3 h-12 w-full" />
                            </li>
                        ))}
                    </ul>
                )}

                {appliedFilters && query.isError && (
                    <ErrorState
                        title="Não foi possível buscar os contatos"
                        error={query.error}
                        onRetry={() => query.refetch()}
                    />
                )}

                {appliedFilters && query.isSuccess && results.length === 0 && (
                    <EmptyState
                        title="Nenhuma mensagem neste período"
                        description="Tente ampliar o período ou deixar as datas em branco."
                    />
                )}

                {appliedFilters && query.isSuccess && results.length > 0 && (
                    <>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted">
                                <strong className="text-ink-900">
                                    {query.totalElements}
                                    {query.totalElements === 1 ? ' mensagem' : ' mensagens'}
                                </strong>
                            </p>

                            <ExportButton
                                loadRows={() => fetchAllContacts(appliedFilters)}
                                columns={EXPORT_COLUMNS}
                                fileName="contatos"
                                sheetName="Contatos"
                            />
                        </div>

                        <ul className="mt-4 space-y-3">
                            {results.map((contact) => (
                                <li
                                    key={contact.id}
                                    className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line sm:p-5"
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <h2 className="font-display text-base font-bold text-ink-900 sm:text-lg">
                                            {contact.name}
                                        </h2>
                                        <span className="text-xs text-muted">
                                            {formatShortDate(contact.creationDate)}
                                        </span>
                                    </div>

                                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                                        <a href={`mailto:${contact.email}`} className="break-all text-brand-700 hover:underline">
                                            {contact.email}
                                        </a>
                                        <a href={`tel:${contact.phoneNumber}`} className="text-brand-700 hover:underline">
                                            {formatPhone(contact.phoneNumber)}
                                        </a>
                                        {contact.city && (
                                            <span className="text-muted">
                                                {contact.city} — {contact.state}
                                            </span>
                                        )}
                                    </p>

                                    <p className="clamp-3 mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-800">
                                        {contact.message}
                                    </p>

                                    <Button
                                        variant="secondary"
                                        className="mt-4"
                                        fullWidth
                                        onClick={() => setOpenContact(contact)}
                                    >
                                        Ver mensagem completa
                                    </Button>
                                </li>
                            ))}
                        </ul>

                        <LoadMore query={query} noun="mensagens" />
                    </>
                )}
            </div>

            {/* Um modal só, alimentado pelo contato guardado no estado — em vez
                de um modal por item da lista. Com 200 contatos, a segunda opção
                criaria 200 modais escondidos no HTML. */}
            <Modal
                isOpen={Boolean(openContact)}
                onClose={() => setOpenContact(null)}
                title={openContact?.name ?? ''}
                description={openContact ? formatDateTime(openContact.creationDate) : ''}
                size="lg"
                footer={
                    openContact && (
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button
                                variant="secondary"
                                href={`mailto:${openContact.email}?subject=${encodeURIComponent('Re: contato pelo site da ABRASCE')}`}
                            >
                                Responder por e-mail
                            </Button>
                            <Button variant="ghost" onClick={() => setOpenContact(null)}>
                                Fechar
                            </Button>
                        </div>
                    )
                }
            >
                {openContact && (
                    <>
                        <dl className="mb-5 grid gap-x-6 gap-y-2 rounded-xl bg-sand p-4 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">E-mail</dt>
                                <dd className="break-all text-ink-900">{openContact.email}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Telefone</dt>
                                <dd className="text-ink-900">{formatPhone(openContact.phoneNumber)}</dd>
                            </div>
                            {openContact.city && (
                                <div>
                                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Cidade</dt>
                                    <dd className="text-ink-900">
                                        {openContact.city} — {openContact.state}
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {/* `whitespace-pre-line` preserva as quebras de linha que
                            a pessoa digitou no formulário. Sem isso, uma
                            mensagem com parágrafos vira um bloco só. */}
                        <p className="whitespace-pre-line text-[0.9375rem] leading-relaxed text-ink-800">
                            {openContact.message}
                        </p>
                    </>
                )}
            </Modal>
        </AdminPage>
    );
}
