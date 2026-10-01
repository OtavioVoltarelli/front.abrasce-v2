/**
 * Contatos — espelha `ContactOutput` do backend v2:
 * id, name, email, phoneNumber, city, state, message, creationDate.
 *
 * `phoneNumber` é texto só com dígitos, igual ao de candidato. (Até o backend
 * mudar, era `Long` aqui e String lá, e o mock copiava a inconsistência.)
 *
 * As mensagens variam de uma linha a vários parágrafos de propósito: a tela de
 * admin precisa mostrar uma prévia curta e abrir o texto completo sob demanda,
 * e isso só dá para avaliar com uma mensagem realmente longa na lista.
 */

import { delay } from './delay';
import { paginate } from './paginate';

const CONTACTS = [
    {
        id: 1,
        name: 'Marcos Antônio Pereira',
        email: 'marcos.pereira@email.com',
        phoneNumber: '11987654321',
        city: 'São Paulo',
        state: 'SP',
        message: 'Boa tarde. Gostaria de saber como faço para me tornar voluntário nos projetos de educação. Tenho disponibilidade nas terças e quintas à noite.',
        creationDate: '2026-08-18T16:42:00',
    },
    {
        id: 2,
        name: 'Renata Figueiredo',
        email: 'renata.fig@email.com',
        phoneNumber: '19991234567',
        city: 'Casa Branca',
        state: 'SP',
        message: 'Prezados,\n\nSou coordenadora pedagógica de uma escola municipal de Casa Branca e gostaria de propor uma parceria entre a nossa unidade e o programa Apoio Escolar da ABRASCE.\n\nTemos hoje cerca de 40 alunos do 6º ao 9º ano com defasagem de aprendizagem em matemática e língua portuguesa, identificada nas avaliações diagnósticas do início do ano. A escola dispõe de sala e material, mas não tem equipe para o contraturno.\n\nMinha proposta é que a ABRASCE ceda professores para duas tardes por semana e que a escola ofereça o espaço, a merenda e o apoio da coordenação. Já conversei com a direção e temos o aval para seguir adiante.\n\nPodemos marcar uma reunião nas próximas semanas? Fico à disposição no telefone informado e neste e-mail.\n\nAtenciosamente,\nRenata Figueiredo',
        creationDate: '2026-08-17T09:15:00',
    },
    {
        id: 3,
        name: 'José Carlos',
        email: 'jc.silva@email.com',
        phoneNumber: '1633221100',
        city: 'Jaboticabal',
        state: 'SP',
        message: 'Como faço para matricular meu filho na escola de artes?',
        creationDate: '2026-08-15T20:03:00',
    },
    {
        id: 4,
        name: 'Patrícia Nunes de Almeida',
        email: 'patricia.almeida@email.com',
        phoneNumber: '11976543210',
        city: 'Guarulhos',
        state: 'SP',
        message: 'Represento uma empresa que tem interesse em apoiar projetos sociais na região. Gostaria de receber o relatório de atividades e o balanço financeiro mais recente para apresentar à nossa diretoria.',
        creationDate: '2026-08-11T11:27:00',
    },
    {
        id: 5,
        name: 'Wagner Souza',
        email: 'wagner.souza@email.com',
        phoneNumber: '11955554444',
        city: 'Francisco Morato',
        state: 'SP',
        message: 'Meu filho participa do Esporte Moratense e queria parabenizar a equipe. Ele mudou muito desde que começou, está mais disciplinado e fez vários amigos. Obrigado pelo trabalho de vocês.',
        creationDate: '2026-08-08T18:50:00',
    },
    {
        id: 6,
        name: 'Luiza Campos',
        email: 'luiza.campos@email.com',
        phoneNumber: '19988887777',
        city: 'Mococa',
        state: 'SP',
        message: 'Existe algum projeto da ABRASCE em Mococa? Se não, há previsão de expansão para a cidade?',
        creationDate: '2026-07-30T08:12:00',
    },
    {
        id: 7,
        name: 'Fernando Tavares',
        email: 'fernando.tavares@email.com',
        phoneNumber: '13991112222',
        city: 'São Vicente',
        state: 'SP',
        message: 'Bom dia. Sou fisioterapeuta e gostaria de oferecer atendimento voluntário aos residentes da Residência Inclusiva. Tenho registro ativo no CREFITO e disponibilidade quinzenal. Como devo proceder?',
        creationDate: '2026-07-24T10:35:00',
    },
    {
        id: 8,
        name: 'Cristina Barbosa',
        email: 'cristina.b@email.com',
        phoneNumber: '11944443333',
        city: 'São Paulo',
        state: 'SP',
        message: 'Gostaria de fazer uma doação mensal. Quais são as formas de pagamento disponíveis e como recebo o comprovante para dedução no imposto de renda?',
        creationDate: '2026-07-19T14:08:00',
    },
];

const clone = (value) => structuredClone(value);

export const contactMockService = {
    /** Espelha o filtro por `startDate`/`finalDate` que o backend real aplica
     *  em `GET /api/contacts` — mesma lógica de `candidateMock.getPage`. Mais
     *  recente primeiro, que é a ordem padrão do `ContactController`. */
    getPage: async ({ startDate, finalDate, page, size } = {}) => {
        await delay(800);

        const from = startDate ? new Date(startDate) : null;
        const to = finalDate ? new Date(finalDate) : null;

        const matching = CONTACTS.filter((contact) => {
            const when = new Date(contact.creationDate);
            if (from && when < from) return false;
            if (to && when > to) return false;
            return true;
        }).toSorted((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

        return clone(paginate(matching, { page, size }));
    },

    send: async (payload) => {
        await delay(1000);
        return clone({ ...payload, id: Date.now(), creationDate: new Date().toISOString() });
    },
};
