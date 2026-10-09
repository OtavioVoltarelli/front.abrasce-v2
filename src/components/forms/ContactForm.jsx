import { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import SubmitError from '../feedback/SubmitError';
import { BRAZILIAN_STATES } from '../../lib/brazilianStates';
import { maskPhone } from '../../lib/format';
import { validateContact } from '../../validations/contactValidation';
import { useSendContact } from '../../hooks/useContact';
import { scrollToFirstError } from '../../lib/scrollToError';

const EMPTY_FORM = {
    name: '',
    email: '',
    phoneNumber: '',
    state: 'SP',
    city: '',
    message: '',
};

const FIELD_ORDER = ['name', 'email', 'phoneNumber', 'message'];

/**
 * Formulário de contato.
 *
 * Os campos são exatamente os mesmos de antes — nome, e-mail, telefone,
 * estado, cidade e mensagem — como pede o briefing. O que mudou é como eles
 * se comportam: validação com mensagens úteis, telefone mascarado enquanto se
 * digita, e o resultado do envio aparece na própria página em vez de num
 * modal que some ao ser fechado.
 */
export default function ContactForm() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

    const mutation = useSendContact();

    const setField = (name, value) => {
        setForm((previous) => ({ ...previous, [name]: value }));
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

        const validationErrors = validateContact(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            scrollToFirstError(FIELD_ORDER, validationErrors);
            return;
        }

        mutation.mutate(form);
    };

    if (mutation.isSuccess) {
        return (
            <div className="rounded-2xl bg-green-50 p-6 text-center ring-1 ring-green-200 sm:p-8">
                <span aria-hidden="true" className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-green-700 shadow-card">
                    <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m4 12 6 6L20 6" />
                    </svg>
                </span>
                <div role="status">
                    <h3 className="mt-4 text-xl text-ink-900">Mensagem enviada</h3>
                    <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] text-ink-800">
                        A equipe da ABRASCE responde pelo e-mail que você informou.
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
                    Enviar outra mensagem
                </Button>
            </div>
        );
    }

    const errorCount = Object.keys(errors).length;

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {hasTriedSubmit && errorCount > 0 && (
                <div role="alert" className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                    <p className="text-sm font-bold text-red-800">
                        {errorCount === 1
                            ? 'Falta corrigir 1 campo antes de enviar.'
                            : `Faltam corrigir ${errorCount} campos antes de enviar.`}
                    </p>
                </div>
            )}

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

            <div className="grid gap-5 sm:grid-cols-[minmax(0,10rem)_1fr]">
                <Select
                    label="Estado"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    options={BRAZILIAN_STATES}
                    autoComplete="address-level1"
                />
                <Input
                    label="Cidade"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    maxLength={255}
                />
            </div>

            <Textarea
                id="message"
                label="Mensagem"
                required
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                error={errors.message}
                placeholder="Conte o que você precisa. Quanto mais detalhes, melhor conseguimos ajudar."
            />

            <SubmitError title="A mensagem não foi enviada." error={mutation.error} />

            <Button type="submit" size="lg" fullWidth className="sm:w-auto" disabled={mutation.isPending}>
                {mutation.isPending ? 'Enviando…' : 'Enviar mensagem'}
            </Button>
        </form>
    );
}
