/**
 * Notícias — dados de mentira, formato de verdade.
 *
 * Cada objeto tem EXATAMENTE os campos de `NewsOutput` do backend v2:
 * id, title, shortDescription, longDescription, creationDate,
 * coverImage (objeto ReusableFileOutput ou null),
 * attachments (lista de `StoredFileOutput` — `{ storedName, originalName,
 * contentType }` — nunca null, lista vazia quando não há anexo).
 *
 * ---------------------------------------------------------------------------
 * A CAPA VIRO REFERÊNCIA, NÃO CÓPIA
 * ---------------------------------------------------------------------------
 * Aqui dentro cada notícia guarda só o `coverImageId`, e a capa é resolvida na
 * LEITURA (`withCover`). Guardar o objeto inteiro dentro da notícia seria mais
 * simples e estaria errado: renomear "Capa padrão" na biblioteca não mudaria o
 * nome que as notícias mostram, e as cópias iam divergindo em silêncio.
 *
 * É exatamente o que o backend faz — `News.coverImage` é `@ManyToOne`, uma
 * chave estrangeira, e o `NewsOutput.from` monta o objeto na hora de responder.
 * O mock imita o join.
 *
 * Isso não é preciosismo: é o que faz a troca por API real ser só apagar
 * este arquivo. Se o mock tivesse `data` em vez de `creationDate`, todo
 * componente que lê `noticia.data` quebraria no dia da integração.
 *
 * A variedade é proposital — títulos de 4 e de 20 palavras, notícias com e
 * sem anexo, texto longo e curto. É assim que se descobre que o card quebra
 * com título comprido ANTES de o cliente descobrir.
 */

import { findReusableFileById } from './reusableFileMock';
import { delay } from './delay';
import { paginate } from './paginate';

/** Imita `StoredFileOutput.from` do backend a partir de um nome de arquivo
 *  fixo — sem servidor de verdade, `storedName` e `originalName` coincidem. */
const toStoredFile = (name) => ({ storedName: name, originalName: name, contentType: 'application/pdf' });

let NEWS = [
    {
        id: 1,
        title: 'Escola de Artes de Jaboticabal abre 120 novas vagas para oficinas de música e dança',
        shortDescription:
            'As inscrições vão até o fim do mês e podem ser feitas presencialmente na sede do projeto. Não há cobrança de mensalidade.',
        longDescription:
            'A Escola de Artes de Jaboticabal, mantida pela ABRASCE em parceria com a prefeitura municipal, abriu 120 novas vagas para as oficinas de música e dança do segundo semestre.\n\nAs turmas atendem crianças e adolescentes de 7 a 17 anos e acontecem no contraturno escolar, de segunda a sexta-feira. Serão oferecidas oficinas de violão, percussão, canto coral, dança contemporânea e dança de salão.\n\nAs inscrições podem ser feitas presencialmente na sede do projeto ou pelo formulário em https://www.abrascesocial.org.br/oficinas/inscricao, mediante apresentação de documento com foto do responsável, comprovante de residência e declaração de matrícula escolar do aluno. Não há cobrança de mensalidade ou taxa de inscrição.\n\nO edital completo está em https://www.prefeitura.jaboticabal.sp.gov.br/cultura/editais/2026/edital-oficinas-musica-danca-versao-final.pdf e as dúvidas podem ser enviadas para oficinas@abrascesocial.org.br.\n\nAs aulas começam na primeira semana do mês seguinte. Em caso de dúvidas, a coordenação atende pelo telefone da associação.',
        creationDate: '2026-07-28T09:15:00',
        coverImageId: 2,
        attachments: ['edital-oficinas-2026.pdf', 'ficha-de-inscricao.pdf'].map(toStoredFile),
    },
    {
        id: 2,
        title: 'Mutirão de saúde atende 340 pessoas em Casa Branca',
        shortDescription:
            'Ação de fim de semana ofereceu aferição de pressão, testes rápidos e orientação nutricional na Praça 14 de Janeiro.',
        longDescription:
            'O mutirão de saúde realizado no último fim de semana na Praça 14 de Janeiro, em Casa Branca, atendeu 340 pessoas ao longo de dois dias.\n\nA ação ofereceu aferição de pressão arterial, testes rápidos, orientação nutricional e encaminhamento para a rede pública nos casos que exigiam acompanhamento. Participaram enfermeiros, nutricionistas e agentes comunitários de saúde do município.\n\nA ABRASCE agradece a todos os voluntários e à comunidade pela participação.',
        creationDate: '2026-07-12T14:40:00',
        coverImageId: 3,
        attachments: [],
    },
    {
        id: 3,
        title: 'Esporte Moratense encerra temporada com torneio comunitário',
        shortDescription:
            'Mais de 200 atletas de 8 a 16 anos participaram da competição, que reuniu famílias no ginásio municipal.',
        longDescription:
            'O projeto Esporte Moratense, de Francisco Morato, encerrou a temporada com um torneio comunitário que reuniu mais de 200 atletas de 8 a 16 anos no ginásio municipal.\n\nA competição contou com modalidades de futsal, vôlei e handebol, divididas por faixa etária. Além das partidas, o evento teve apresentação da fanfarra da escola municipal e distribuição de lanches às famílias presentes.\n\nAo longo do ano, o projeto atendeu 380 crianças e adolescentes em treinos regulares de segunda a sábado.',
        creationDate: '2026-06-30T17:00:00',
        coverImageId: 4,
        attachments: ['relatorio-temporada.pdf'].map(toStoredFile),
    },
    {
        id: 4,
        title: 'Novo balanço financeiro disponível',
        shortDescription: 'O documento referente ao exercício anterior já está na área de transparência.',
        longDescription:
            'O balanço financeiro referente ao exercício anterior, auditado por empresa independente, já está disponível na área de transparência do site.\n\nO documento detalha a origem de todos os recursos recebidos, sua destinação por projeto e município, e os custos administrativos da associação no período.\n\nO documento pode ser consultado na área de transparência do site (www.abrascesocial.org.br/transparencia). A ABRASCE reforça seu compromisso com a prestação de contas clara e acessível a doadores, parceiros e à comunidade atendida.',
        creationDate: '2026-06-05T08:00:00',
        coverImageId: 1,
        attachments: ['balanco-financeiro.pdf', 'parecer-auditoria.pdf', 'notas-explicativas.pdf'].map(toStoredFile),
    },
    {
        id: 5,
        title: 'Programa Apoio Escolar amplia atendimento e passa a receber alunos do ensino médio',
        shortDescription:
            'Até agora restrito ao fundamental, o reforço escolar de Jaboticabal abre turmas de matemática e redação para o ensino médio.',
        longDescription:
            'O programa Apoio Escolar, mantido pela ABRASCE em Jaboticabal, ampliou seu atendimento e passa a receber também alunos do ensino médio.\n\nAté agora, o reforço escolar era restrito ao ensino fundamental. Com a ampliação, foram abertas turmas de matemática e redação voltadas à preparação para o ENEM e para os vestibulares.\n\nAs aulas acontecem três vezes por semana, no período da noite, e são conduzidas por professores voluntários da rede pública municipal. O material didático é fornecido gratuitamente pelo projeto.\n\nA procura na primeira semana superou o número de vagas disponíveis, e uma lista de espera foi aberta para uma segunda turma.',
        creationDate: '2026-05-19T11:25:00',
        coverImageId: 1,
        attachments: [],
    },
    {
        id: 6,
        title: 'Residência Inclusiva completa cinco anos',
        shortDescription:
            'A unidade de Casa Branca acolhe adultos com deficiência em situação de vulnerabilidade e dependência de cuidados.',
        longDescription:
            'A Residência Inclusiva de Casa Branca, gerida pela ABRASCE, completou cinco anos de funcionamento.\n\nO serviço acolhe adultos com deficiência em situação de vulnerabilidade e dependência de cuidados, oferecendo moradia, alimentação, acompanhamento de saúde e atividades de convivência em um ambiente residencial.\n\nA equipe é formada por cuidadores, técnicos de enfermagem, assistente social e psicóloga, com atendimento 24 horas por dia.',
        creationDate: '2026-04-22T16:10:00',
        coverImageId: 6,
        attachments: [],
    },
    {
        id: 7,
        title: 'Colônia de férias reúne 90 crianças em atividades ao ar livre',
        shortDescription:
            'Uma semana de jogos cooperativos, oficinas de arte e piqueniques na área verde do município.',
        longDescription:
            'A colônia de férias organizada pela ABRASCE reuniu 90 crianças de 6 a 12 anos durante uma semana de atividades ao ar livre.\n\nA programação incluiu jogos cooperativos, oficinas de arte com material reciclado, contação de histórias e piqueniques na área verde do município. Todas as atividades foram gratuitas, com transporte e lanche fornecidos pelo projeto.',
        creationDate: '2026-01-30T10:00:00',
        coverImageId: 5,
        attachments: [],
    },
];

/** Próximo id. `Math.max` sobre os ids atuais evita colisão após uma exclusão. */
let nextId = Math.max(...NEWS.map((item) => item.id)) + 1;

/**
 * `structuredClone` devolve uma cópia profunda a cada chamada.
 * Sem isso, um componente que ordenasse ou alterasse a lista estaria mexendo
 * no array original deste módulo — e a "próxima requisição" viria diferente.
 * O React Query também guarda a resposta em cache; mutar esse objeto é uma
 * das causas mais comuns de bug difícil de rastrear.
 */
const clone = (value) => structuredClone(value);

/**
 * Faz o papel do join do banco: troca o `coverImageId` pelo objeto da
 * biblioteca, que é o formato do `NewsOutput`. Uma capa apagada da biblioteca
 * vira `null` — e não um id órfão apontando para nada, que quebraria a tela.
 */
const withCover = (news) => ({
    ...clone(news),
    coverImage: clone(findReusableFileById(news.coverImageId)),
});

/**
 * Transforma o que o formulário entrega (um `File` do navegador) no formato
 * que o backend devolveria (`StoredFileOutput`). `URL.createObjectURL` cria
 * um endereço temporário que a tela consegue abrir — é o suficiente para ver
 * a tela funcionando sem servidor.
 */
const fileToStoredFile = (file) =>
    file instanceof File
        ? { storedName: URL.createObjectURL(file), originalName: file.name, contentType: file.type }
        : file;

/**
 * Quais notícias usam este arquivo como capa — faz o papel da consulta que o
 * backend roda para `usageCount`, para `GET /reusable-files/{id}/usages` e
 * para recusar a exclusão de um arquivo em uso. Síncrona e sem atraso porque
 * é chamada DE DENTRO do mock da biblioteca, que já tem o próprio atraso.
 */
export const newsUsingCover = (fileId) =>
    NEWS.filter((item) => item.coverImageId === Number(fileId)).toSorted(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
    );

export const newsMockService = {
    getPage: async ({ page, size }) => {
        await delay();
        // Mais recente primeiro. `toSorted` devolve um array NOVO — `sort()`
        // ordenaria o array deste módulo no lugar, e a ordem "original"
        // deixaria de existir.
        const sorted = NEWS.map(withCover).toSorted(
            (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        );
        return paginate(sorted, { page, size });
    },

    getLatest: async (quantity = 6) => {
        await delay();
        return NEWS.slice(0, quantity).map(withCover);
    },

    getById: async (id) => {
        await delay();
        const found = NEWS.find((item) => String(item.id) === String(id));
        if (!found) throw new Error('Notícia não encontrada.');
        return withCover(found);
    },

    /* ----------------------------------------------------------- escrita */

    create: async ({ coverImageId, files = [], ...data }) => {
        await delay(900);

        const created = {
            ...data,
            id: nextId,
            creationDate: new Date().toISOString(),
            coverImageId: Number(coverImageId),
            attachments: files.map(fileToStoredFile),
        };

        nextId += 1;
        NEWS = [created, ...NEWS];
        return withCover(created);
    },

    update: async (id, { coverImageId, files, ...data }) => {
        await delay(900);

        const index = NEWS.findIndex((item) => String(item.id) === String(id));
        if (index === -1) throw new Error('Notícia não encontrada.');

        const current = NEWS[index];
        const updated = {
            ...current,
            ...data,
            // Campo em branco = "não mexi nisso", e não "apague". Sem esta
            // checagem, editar só o título limparia a capa e os anexos.
            coverImageId: coverImageId ? Number(coverImageId) : current.coverImageId,
            attachments: files ? files.map(fileToStoredFile) : current.attachments,
        };

        NEWS = NEWS.with(index, updated);
        return withCover(updated);
    },

    remove: async (id) => {
        await delay(700);
        const exists = NEWS.some((item) => String(item.id) === String(id));
        if (!exists) throw new Error('Notícia não encontrada.');
        NEWS = NEWS.filter((item) => String(item.id) !== String(id));
    },
};
