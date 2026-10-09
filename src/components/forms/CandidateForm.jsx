import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import SubmitError from '../feedback/SubmitError';
import FileUpload from '../ui/FileUpload';
import { BRAZILIAN_STATES } from '../../lib/brazilianStates';
import { formatCnpj, formatCpf, maskPhone } from '../../lib/format';
import { validateCandidate } from '../../validations/candidateValidation';
import { useCreateCandidate } from '../../hooks/useCandidate';
import { scrollToFirstError } from '../../lib/scrollToError';
import { MAX_FILE_SIZE_MB } from '../../lib/uploadRules';

const EMPTY_FORM = {
    name: '',
    email: '',
    phoneNumber: '',
    cpf: '',
    companyName: '',
    cnpj: '',
    state: 'SP',
    city: '',
    cv: null,
};

const FIELD_ORDER = ['name', 'email', 'phoneNumber', 'cpf', 'cnpj', 'state', 'city', 'cv'];

/**
 * Formulário de inscrição em um processo seletivo.
 *
 * ---------------------------------------------------------------------------
 * DECISÕES DE EXPERIÊNCIA
 * ---------------------------------------------------------------------------
 * · Fica NA PRÓPRIA PÁGINA, não num modal. Um formulário de 9 campos dentro de
 *   um modal no celular é uma caixa que rola dentro de outra que rola, com o
 *   teclado virtual cobrindo metade — e o candidato perde o edital de vista.
 *   Modal serve para tarefa curta; isto é uma tarefa longa.
 *
 * · Os campos são MASCARADOS enquanto a pessoa digita (telefone, CPF, CNPJ).
 *   Ver o número tomando forma confirma que está indo bem, e evita o clássico
 *   "digitei certo e ele diz que está errado" por causa de pontuação.
 *
 * · A validação só aparece DEPOIS da primeira tentativa de enviar. Marcar
 *   "e-mail inválido" enquanto a pessoa ainda está digitando a primeira letra
 *   é hostil. A partir daí, o erro de cada campo some assim que ele é corrigido.
 *
 * · Erro de envio vira um AVISO no topo do formulário, não um modal: o modal
 *   some quando fechado e leva a informação junto.
 */
export default function CandidateForm({ recruitmentProcessId, processTitle }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

    const mutation = useCreateCandidate();

    const setField = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));
        // Some com o erro daquele campo assim que ele muda — mas só se já
        // estávamos mostrando erros.
        if (hasTriedSubmit) {
            setErrors((previous) => {
                const next = { ...previous };
                delete next[name];
                return next;
            });
        }
    };

    const handleChange = (event) => setField(event.target.name, event.target.value);

    const handleSubmit = (event) => {
        event.preventDefault();
        setHasTriedSubmit(true);

        const validationErrors = validateCandidate(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            // Leva a pessoa até o PRIMEIRO campo inválido. Sem isso, quem está
            // no fim de um formulário de 9 campos aperta "Enviar", nada visível
            // muda perto do botão, e o campo que falhou pode estar lá em cima,
            // fora da tela.
            scrollToFirstError(FIELD_ORDER, validationErrors);
            return;
        }

        mutation.mutate({ ...form, recruitmentProcessId });
    };

    /* ------------------------------------------------------ estado: sucesso */
    if (mutation.isSuccess) {
        return (
            <div className="rounded-2xl bg-green-50 p-6 text-center ring-1 ring-green-200 sm:p-10">
                <span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-green-700 shadow-card">
                    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m4 12 6 6L20 6" />
                    </svg>
                </span>
                {/* role="status" faz o leitor de tela anunciar a confirmação
                    assim que ela substitui o formulário. */}
                <div role="status">
                    <h3 className="mt-4 text-xl text-ink-900">Inscrição enviada</h3>
                    <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-ink-800">
                        Sua candidatura para <strong>{processTitle}</strong> foi registrada.
                        A ABRASCE entra em contato pelo e-mail e telefone informados.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    className="mt-6"
                    onClick={() => {
                        setForm(EMPTY_FORM);
                        setHasTriedSubmit(false);
                        mutation.reset();
                    }}
                >
                    Fazer outra inscrição
                </Button>
            </div>
        );
    }

    /* ----------------------------------------------------- estado: formulário */
    const errorCount = Object.keys(errors).length;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Resumo de erros — a contagem dá o panorama geral; o scroll (no
                `handleSubmit`) já leva a pessoa até o campo específico. */}
            {hasTriedSubmit && errorCount > 0 && (
                <div role="alert" className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                    <p className="text-sm font-bold text-red-800">
                        {errorCount === 1
                            ? 'Falta corrigir 1 campo antes de enviar.'
                            : `Faltam corrigir ${errorCount} campos antes de enviar.`}
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                        As mensagens estão logo abaixo de cada campo.
                    </p>
                </div>
            )}

            <fieldset className="space-y-5">
                {/* <legend> nomeia o grupo de campos para o leitor de tela.
                    `sr-only` porque o título visual já está na seção acima. */}
                <legend className="sr-only">Seus dados</legend>

                <Input
                    id="name"
                    label="Nome completo"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    autoComplete="name"
                    maxLength={255}
                />

                {/* Duas colunas só a partir do tablet. No celular, campos lado a
                    lado ficam estreitos demais para o texto que recebem. */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                        id="email"
                        label="E-mail"
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        autoComplete="email"
                        inputMode="email"
                        placeholder="voce@email.com"
                    />
                    <Input
                        id="phoneNumber"
                        label="Telefone"
                        required
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={(event) => setField('phoneNumber', maskPhone(event.target.value))}
                        error={errors.phoneNumber}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="(11) 98888-7777"
                        maxLength={15}
                    />
                </div>

                <Input
                    id="cpf"
                    label="CPF"
                    required
                    name="cpf"
                    value={form.cpf}
                    onChange={(event) => setField('cpf', formatCpf(event.target.value))}
                    error={errors.cpf}
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    maxLength={14}
                />
            </fieldset>

            <fieldset className="space-y-5 rounded-xl bg-sand p-5">
                <legend className="px-1 text-sm font-semibold text-ink-800">
                    Dados de pessoa jurídica
                    <span className="ml-1 font-normal text-muted">(opcional)</span>
                </legend>
                <p className="text-sm text-muted">
                    Preencha apenas se você for se candidatar como pessoa jurídica.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                        label="Razão social"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        maxLength={255}
                    />
                    <Input
                        id="cnpj"
                        label="CNPJ"
                        name="cnpj"
                        value={form.cnpj}
                        onChange={(event) => setField('cnpj', formatCnpj(event.target.value))}
                        error={errors.cnpj}
                        inputMode="numeric"
                        placeholder="00.000.000/0000-00"
                        maxLength={18}
                    />
                </div>
            </fieldset>

            <fieldset className="space-y-5">
                <legend className="sr-only">Onde você mora</legend>
                <div className="grid gap-5 sm:grid-cols-[minmax(0,10rem)_1fr]">
                    <Select
                        id="state"
                        label="Estado"
                        required
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        error={errors.state}
                        options={BRAZILIAN_STATES}
                        autoComplete="address-level1"
                    />
                    <Input
                        id="city"
                        label="Cidade"
                        required
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        error={errors.city}
                        autoComplete="address-level2"
                        maxLength={255}
                    />
                </div>
            </fieldset>

            <FileUpload
                id="cv"
                label="Currículo"
                required
                hint={`Arquivo em PDF ou Word, de até ${MAX_FILE_SIZE_MB.cv} MB.`}
                value={form.cv}
                onChange={(file) => setField('cv', file)}
                error={errors.cv}
                category="cv"
            />

            <SubmitError title="A inscrição não foi enviada." error={mutation.error} />

            {/* Botão de largura total no celular (alvo enorme, fácil de acertar)
                e largura natural no desktop. */}
            <Button type="submit" size="lg" fullWidth className="sm:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? 'Enviando inscrição…' : 'Enviar inscrição'}
            </Button>

            <p className="text-xs text-muted">
                Ao enviar, seus dados são encaminhados à equipe da ABRASCE responsável por
                este processo seletivo.
            </p>
        </form>
    );
}
