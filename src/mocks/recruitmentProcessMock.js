/**
 * Processos seletivos — espelha `RecruitmentProcessOutput` do backend v2:
 * id, title, description, active, creationDate,
 * filesPaths (lista de `StoredFileOutput` — `{ storedName, originalName,
 * contentType }` — nunca null, lista vazia quando não há anexo).
 *
 * Atenção ao nome do campo de anexos: aqui é `filesPaths` (com S no meio),
 * enquanto em notícias é `filesPath`. É assim no backend — a inconsistência é
 * real e está copiada de propósito. Se eu "arrumasse" no mock, a integração
 * quebraria e ninguém entenderia por quê.
 *
 * A lista tem processos ativos e inativos, com e sem anexo, com descrições
 * de tamanhos bem diferentes.
 */

import { delay } from './delay';

/** Imita `StoredFileOutput.from` do backend a partir de um nome de arquivo
 *  fixo — sem servidor de verdade, `storedName` e `originalName` coincidem. */
const toStoredFile = (name) => ({ storedName: name, originalName: name, contentType: 'application/pdf' });

let RECRUITMENT_PROCESSES = [
    {
        id: 1,
        title: 'Professor de música — Escola de Artes (Jaboticabal/SP)',
        description:
            'A ABRASCE seleciona professor de música para atuar nas oficinas da Escola de Artes de Jaboticabal.\n\nATRIBUIÇÕES\nMinistrar oficinas de violão e percussão para crianças e adolescentes de 7 a 17 anos, no contraturno escolar; planejar aulas e registrar frequência; participar das reuniões pedagógicas mensais.\n\nREQUISITOS\nFormação em música ou experiência comprovada de no mínimo dois anos com ensino musical para crianças e adolescentes. Disponibilidade para trabalhar de segunda a sexta-feira, 20 horas semanais.\n\nCARGA HORÁRIA E REMUNERAÇÃO\n20 horas semanais. Remuneração e benefícios detalhados no edital anexo.\n\nINSCRIÇÕES\nAs inscrições são feitas exclusivamente por este site, com o envio do currículo no formulário ao final desta página. Leia o edital completo antes de se inscrever.\n\nO edital na íntegra está em https://www.abrascesocial.org.br/vagas/edital-2026.pdf e as dúvidas devem ser enviadas para selecao@abrascesocial.org.br.',
        active: true,
        creationDate: '2026-08-04T09:00:00',
        filesPaths: ['edital-professor-musica.pdf', 'anexo-i-cronograma.pdf'].map(toStoredFile),
    },
    {
        id: 2,
        title: 'Assistente social — Residência Inclusiva (Casa Branca/SP)',
        description:
            'Vaga para assistente social na Residência Inclusiva de Casa Branca.\n\nATRIBUIÇÕES\nAcompanhamento social dos residentes e de suas famílias; elaboração de relatórios técnicos; articulação com a rede de proteção social do município.\n\nREQUISITOS\nGraduação em Serviço Social e registro ativo no CRESS. Experiência com serviços de acolhimento institucional será considerada diferencial.\n\nCARGA HORÁRIA\n30 horas semanais, de segunda a sexta-feira.',
        active: true,
        creationDate: '2026-07-21T13:30:00',
        filesPaths: ['edital-assistente-social.pdf'].map(toStoredFile),
    },
    {
        id: 3,
        title: 'Auxiliar administrativo',
        description:
            'Vaga para auxiliar administrativo na sede da ABRASCE, em São Paulo. Atividades de apoio à rotina administrativa, organização de documentos e atendimento telefônico. Ensino médio completo. 40 horas semanais.',
        active: true,
        creationDate: '2026-07-09T10:15:00',
        filesPaths: [],
    },
    {
        id: 4,
        title: 'Cuidador — Residência Inclusiva (Casa Branca/SP)',
        description:
            'Seleção de cuidadores para a Residência Inclusiva de Casa Branca, em regime de escala 12x36.\n\nATRIBUIÇÕES\nApoio nas atividades da vida diária dos residentes: higiene, alimentação, medicação sob orientação da enfermagem, acompanhamento em consultas e atividades de convivência.\n\nREQUISITOS\nEnsino médio completo e curso de cuidador de idosos ou de pessoas com deficiência. Experiência anterior em serviço de acolhimento é desejável, mas não obrigatória.\n\nO processo contempla análise curricular, entrevista e formação inicial obrigatória de 16 horas, remunerada.',
        active: true,
        creationDate: '2026-06-27T08:45:00',
        filesPaths: ['edital-cuidador.pdf', 'anexo-escala.pdf', 'declaracao-de-experiencia.pdf'].map(toStoredFile),
    },
    {
        id: 5,
        title: 'Coordenador pedagógico — Apoio Escolar (Jaboticabal/SP)',
        description:
            'Vaga encerrada. Coordenação pedagógica do programa Apoio Escolar, com responsabilidade sobre o planejamento das turmas de reforço e a formação continuada dos professores voluntários.',
        active: false,
        creationDate: '2026-03-11T15:20:00',
        filesPaths: ['edital-coordenador.pdf'].map(toStoredFile),
    },
    {
        id: 6,
        title: 'Estágio em comunicação',
        description:
            'Vaga encerrada. Estágio em comunicação para estudantes a partir do 3º semestre de Jornalismo, Publicidade ou Relações Públicas.',
        active: false,
        creationDate: '2026-02-02T09:30:00',
        filesPaths: [],
    },
];

let nextId = Math.max(...RECRUITMENT_PROCESSES.map((item) => item.id)) + 1;

const clone = (value) => structuredClone(value);

/** Transforma um `File` do navegador no formato que o backend devolveria
 *  (`StoredFileOutput`) — mesma lógica do `newsMock.js`. */
const fileToStoredFile = (file) =>
    file instanceof File
        ? { storedName: URL.createObjectURL(file), originalName: file.name, contentType: file.type }
        : file;

export const recruitmentProcessMockService = {
    getAll: async () => {
        await delay();
        return clone(RECRUITMENT_PROCESSES).toSorted(
            (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        );
    },

    getActives: async () => {
        await delay();
        return clone(RECRUITMENT_PROCESSES.filter((process) => process.active));
    },

    getById: async (id) => {
        await delay();
        const found = RECRUITMENT_PROCESSES.find((item) => String(item.id) === String(id));
        if (!found) throw new Error('Processo seletivo não encontrado.');
        return clone(found);
    },

    /* ----------------------------------------------------------- escrita */

    create: async ({ files = [], ...data }) => {
        await delay(900);

        const created = {
            ...data,
            id: nextId,
            creationDate: new Date().toISOString(),
            filesPaths: files.map(fileToStoredFile),
        };

        nextId += 1;
        RECRUITMENT_PROCESSES = [created, ...RECRUITMENT_PROCESSES];
        return clone(created);
    },

    update: async (id, { files, ...data }) => {
        await delay(900);

        const index = RECRUITMENT_PROCESSES.findIndex((item) => String(item.id) === String(id));
        if (index === -1) throw new Error('Processo seletivo não encontrado.');

        const current = RECRUITMENT_PROCESSES[index];
        const updated = {
            ...current,
            ...data,
            filesPaths: files ? files.map(fileToStoredFile) : current.filesPaths,
        };

        RECRUITMENT_PROCESSES = RECRUITMENT_PROCESSES.with(index, updated);
        return clone(updated);
    },

    remove: async (id) => {
        await delay(700);
        const exists = RECRUITMENT_PROCESSES.some((item) => String(item.id) === String(id));
        if (!exists) throw new Error('Processo seletivo não encontrado.');
        RECRUITMENT_PROCESSES = RECRUITMENT_PROCESSES.filter(
            (item) => String(item.id) !== String(id)
        );
    },
};
