/**
 * Candidatos — espelha `CandidateOutput` do backend v2:
 * id, name, email, phoneNumber, cpf, companyName, cnpj, state, city,
 * cv (objeto `StoredFileOutput` — `{ storedName, originalName, contentType }`
 * — ou null), candidateDate, recruitmentProcessId.
 *
 * Note que `companyName` e `cnpj` vêm vazios na maioria — no backend eles são
 * opcionais (não têm @NotBlank). A listagem do admin precisa aguentar isso sem
 * mostrar buraco.
 */

import { delay } from './delay';

/** Todo candidato deste mock tem currículo; o formato imita exatamente
 *  `StoredFileOutput.from` no backend — sem `id`, só os três campos. */
const cv = (name) => ({ storedName: name, originalName: name, contentType: 'application/pdf' });

const CANDIDATES = [
    { id: 1, name: 'Ana Cláudia Ferreira dos Santos', email: 'ana.ferreira@email.com', phoneNumber: '16991234567', cpf: '12345678909', companyName: '', cnpj: '', state: 'SP', city: 'Jaboticabal', cv: cv('cv-ana-claudia.pdf'), candidateDate: '2026-08-06T14:22:00', recruitmentProcessId: 1 },
    { id: 2, name: 'Bruno Tadeu Oliveira', email: 'brunotadeu@email.com', phoneNumber: '16998887766', cpf: '98765432100', companyName: 'Bruno Oliveira Música ME', cnpj: '12345678000195', state: 'SP', city: 'Ribeirão Preto', cv: cv('cv-bruno-tadeu.pdf'), candidateDate: '2026-08-06T09:05:00', recruitmentProcessId: 1 },
    { id: 3, name: 'Carla Meneses', email: 'carla.meneses@email.com', phoneNumber: '1633445566', cpf: '11122233396', companyName: '', cnpj: '', state: 'SP', city: 'Jaboticabal', cv: cv('cv-carla-meneses.pdf'), candidateDate: '2026-08-05T18:47:00', recruitmentProcessId: 1 },
    { id: 4, name: 'Diego Ramos da Silva Nascimento Júnior', email: 'diego.ramos.nascimento@email.com', phoneNumber: '19987654321', cpf: '44455566677', companyName: '', cnpj: '', state: 'SP', city: 'Casa Branca', cv: cv('cv-diego-ramos.pdf'), candidateDate: '2026-07-29T11:12:00', recruitmentProcessId: 2 },
    { id: 5, name: 'Eliane Souza', email: 'eliane.souza@email.com', phoneNumber: '19991112233', cpf: '55566677788', companyName: '', cnpj: '', state: 'MG', city: 'Poços de Caldas', cv: cv('cv-eliane-souza.pdf'), candidateDate: '2026-07-28T08:30:00', recruitmentProcessId: 2 },
    { id: 6, name: 'Fábio Nogueira', email: 'fabio.nog@email.com', phoneNumber: '11974445555', cpf: '66677788899', companyName: '', cnpj: '', state: 'SP', city: 'São Paulo', cv: cv('cv-fabio-nogueira.pdf'), candidateDate: '2026-07-15T16:00:00', recruitmentProcessId: 3 },
    { id: 7, name: 'Gabriela Lima Vasconcelos', email: 'gabi.lima@email.com', phoneNumber: '11963332222', cpf: '77788899900', companyName: '', cnpj: '', state: 'SP', city: 'Guarulhos', cv: cv('cv-gabriela-lima.pdf'), candidateDate: '2026-07-14T10:44:00', recruitmentProcessId: 3 },
    { id: 8, name: 'Helena Prado', email: 'helena.prado@email.com', phoneNumber: '19992223344', cpf: '88899900011', companyName: '', cnpj: '', state: 'SP', city: 'Casa Branca', cv: cv('cv-helena-prado.pdf'), candidateDate: '2026-07-02T13:20:00', recruitmentProcessId: 4 },
    { id: 9, name: 'Igor Bastos', email: 'igor.bastos@email.com', phoneNumber: '19993334455', cpf: '99900011122', companyName: '', cnpj: '', state: 'SP', city: 'Mococa', cv: cv('cv-igor-bastos.pdf'), candidateDate: '2026-06-30T09:10:00', recruitmentProcessId: 4 },
    { id: 10, name: 'Juliana Alves Ribeiro', email: 'juliana.ribeiro@email.com', phoneNumber: '19994445566', cpf: '10111213141', companyName: '', cnpj: '', state: 'SP', city: 'São João da Boa Vista', cv: cv('cv-juliana-alves.pdf'), candidateDate: '2026-06-29T20:05:00', recruitmentProcessId: 4 },
    { id: 11, name: 'Karina Duarte', email: 'karina.duarte@email.com', phoneNumber: '16995556677', cpf: '21222324252', companyName: '', cnpj: '', state: 'SP', city: 'Jaboticabal', cv: cv('cv-karina-duarte.pdf'), candidateDate: '2026-03-14T15:33:00', recruitmentProcessId: 5 },
    { id: 12, name: 'Lucas Moreira', email: 'lucas.moreira@email.com', phoneNumber: '16996667788', cpf: '31323334353', companyName: '', cnpj: '', state: 'SP', city: 'Taquaritinga', cv: cv('cv-lucas-moreira.pdf'), candidateDate: '2026-03-13T11:48:00', recruitmentProcessId: 5 },
];

const clone = (value) => structuredClone(value);

export const candidateMockService = {
    /**
     * Mesma assinatura do endpoint real:
     * GET /api/candidates/recruitment-process?recruitmentProcessId&startDate&finalDate
     * A filtragem por data acontece aqui só porque não há servidor; na versão
     * real quem filtra é o banco.
     */
    findByFilter: async ({ recruitmentProcessId, startDate, finalDate }) => {
        await delay(800);

        const from = startDate ? new Date(startDate) : null;
        const to = finalDate ? new Date(finalDate) : null;

        return clone(
            CANDIDATES.filter((candidate) => {
                if (String(candidate.recruitmentProcessId) !== String(recruitmentProcessId)) return false;
                const when = new Date(candidate.candidateDate);
                if (from && when < from) return false;
                if (to && when > to) return false;
                return true;
            })
        );
    },

    create: async (payload) => {
        await delay(900);
        return clone({ ...payload, id: Date.now(), candidateDate: new Date().toISOString() });
    },
};
