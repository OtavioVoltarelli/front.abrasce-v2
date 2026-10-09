/**
 * Biblioteca de arquivos reutilizáveis — dados de mentira, formato de verdade.
 * ---------------------------------------------------------------------------
 * Cada objeto tem EXATAMENTE os campos de `ReusableFileOutput` do backend v2:
 *   id, name, storedName, originalName, contentType, creationDate,
 *   kind, usageCount
 * Os dois últimos NÃO ficam guardados aqui: são calculados na leitura
 * (`toOutput`), do mesmo jeito que o backend calcula na hora de responder.
 *
 * Os três nomes são diferentes de propósito, e a distinção é do backend:
 *   name         rótulo escolhido na biblioteca ("Capa padrão — Educação")
 *   originalName nome que veio do computador ("capa-educacao.jpg")
 *   storedName   nome físico no disco ("uuid_capa-educacao.jpg")
 * O `storedName` é o que vai na URL da imagem; o `originalName` é o que a
 * pessoa recebe ao baixar. Achatar os três num campo só parece simplificação
 * até alguém baixar um arquivo chamado "947ebbe2-3c1a-capa.jpg".
 *
 * ⚠️ NO MOCK, `storedName` guarda a URL que o Vite gerou para a imagem do
 * pacote, e não um nome de arquivo — porque aqui não existe servidor em
 * `/api/files/admin/`. Funciona porque `fileUrl()` devolve intacto qualquer
 * caminho que já comece com `/`, `http:` ou `blob:`. Na integração, o
 * `storedName` volta a ser um nome e o `fileUrl` monta a URL sozinho.
 */

import capaEducacao from '../assets/areas/educacao-1200w.jpg';
import capaEsporte from '../assets/areas/esporte-1200w.jpg';
import capaCultura from '../assets/areas/cultura-1200w.jpg';
import capaSaude from '../assets/areas/saude-1200w.jpg';
import capaLazer from '../assets/areas/lazer-1200w.jpg';
import capaAssistencia from '../assets/areas/assistencia-social-1200w.jpg';
import logo from '../assets/logo.png';
import marcaPaie from '../assets/projects/paie.jpeg';
import marcaEscolaDeArtes from '../assets/projects/escola-de-artes.jpeg';
import { delay } from './delay';
import { paginate } from './paginate';
import { fileKind } from '../lib/fileKind';

let FILES = [
    {
        id: 1,
        name: 'Capa padrão — Educação',
        storedName: capaEducacao,
        originalName: 'capa-educacao.jpg',
        contentType: 'image/jpeg',
        creationDate: '2026-02-10T08:30:00',
    },
    {
        id: 2,
        name: 'Oficinas de música e dança',
        storedName: capaCultura,
        originalName: 'oficinas-musica-danca.jpg',
        contentType: 'image/jpeg',
        creationDate: '2026-03-04T11:05:00',
    },
    {
        id: 3,
        name: 'Mutirão de saúde',
        storedName: capaSaude,
        originalName: 'mutirao-saude.jpg',
        contentType: 'image/jpeg',
        creationDate: '2026-03-22T16:45:00',
    },
    {
        id: 4,
        name: 'Torneio comunitário de futsal',
        storedName: capaEsporte,
        originalName: 'torneio-comunitario.jpg',
        contentType: 'image/jpeg',
        creationDate: '2026-04-08T09:00:00',
    },
    {
        id: 5,
        name: 'Colônia de férias',
        storedName: capaLazer,
        originalName: 'colonia-de-ferias.jpg',
        contentType: 'image/jpeg',
        creationDate: '2026-04-30T14:20:00',
    },
    {
        id: 6,
        // Nome comprido de propósito: é assim que se descobre se o card da
        // grade quebra ANTES de o administrador descobrir.
        name: 'Atendimento da equipe de assistência social na unidade de Francisco Morato',
        storedName: capaAssistencia,
        originalName: 'assistencia-social-atendimento-unidade-francisco-morato.jpg',
        contentType: 'image/jpeg',
        creationDate: '2026-05-12T10:10:00',
    },
    {
        id: 7,
        name: 'Logo ABRASCE (fundo claro)',
        storedName: logo,
        originalName: 'logo-abrasce.png',
        contentType: 'image/png',
        creationDate: '2026-01-15T07:55:00',
    },
    {
        id: 8,
        name: 'Marca do projeto Paiê',
        storedName: marcaPaie,
        originalName: 'paie.jpeg',
        contentType: 'image/jpeg',
        creationDate: '2026-01-15T08:02:00',
    },
    {
        id: 9,
        name: 'Marca da Escola de Artes',
        storedName: marcaEscolaDeArtes,
        originalName: 'escola-de-artes.jpeg',
        contentType: 'image/jpeg',
        creationDate: '2026-01-15T08:04:00',
    },
    {
        id: 10,
        name: 'Edital das oficinas 2026',
        storedName: 'b1c9f0a2-4d7e_edital-oficinas-2026.pdf',
        originalName: 'edital-oficinas-2026.pdf',
        contentType: 'application/pdf',
        creationDate: '2026-06-01T13:30:00',
    },
    {
        id: 11,
        name: 'Relatório de atividades 2025',
        storedName: 'c7e2a91b-8f30_relatorio-atividades-2025.pdf',
        originalName: 'relatorio-atividades-2025.pdf',
        contentType: 'application/pdf',
        creationDate: '2026-02-28T17:00:00',
    },
    {
        id: 12,
        name: 'Modelo de declaração de voluntariado',
        storedName: 'd0a4b6c8-1e57_modelo-declaracao-voluntariado.docx',
        originalName: 'modelo-declaracao-voluntariado.docx',
        contentType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        creationDate: '2026-05-20T09:40:00',
    },
    {
        id: 13,
        name: 'Planilha de presença — Esporte Moratense',
        storedName: 'e5f81023-9ab4_presenca-esporte-moratense.xlsx',
        originalName: 'presenca-esporte-moratense.xlsx',
        contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        creationDate: '2026-07-02T18:15:00',
    },
    {
        id: 14,
        // `contentType` nulo de propósito: acontece de verdade quando o
        // navegador não reconhece o arquivo. É o caso que obriga a
        // classificação a ter um plano B pela extensão do nome.
        name: 'Ata da assembleia de fundação',
        storedName: 'f3d70b15-6c29_ata-assembleia-fundacao.pdf',
        originalName: 'ata-assembleia-fundacao.pdf',
        contentType: null,
        creationDate: '2026-01-08T15:25:00',
    },
];

let nextId = 15;

/* Mais recente primeiro — é a ordem que faz sentido numa biblioteca: o
   arquivo que você acabou de subir é o que você vai usar agora. */
const sorted = () =>
    FILES.toSorted((a, b) => b.creationDate.localeCompare(a.creationDate));

/* No navegador, um `File` escolhido pela pessoa vira uma URL temporária
   (`blob:`) que só existe nesta aba e some ao recarregar. É o suficiente para
   a pré-visualização funcionar sem servidor. */
const toStoredName = (file) => URL.createObjectURL(file);

const nameWithoutExtension = (fileName = '') => {
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
};

/* `structuredClone` a cada leitura: sem isso, a tela receberia o MESMO objeto
   que está no array e qualquer alteração feita num componente mudaria o
   "banco" pelas costas — um bug que a API real nunca teria, porque lá cada
   resposta é um JSON novo. */
const clone = (value) => structuredClone(value);

/**
 * Acesso SÍNCRONO, para o mock de notícias montar a capa embutida.
 * Não existe equivalente na API real: lá o backend faz o join e já devolve o
 * `coverImage` dentro do `NewsOutput`. Aqui esta função faz o papel do join.
 */
export const findReusableFileById = (id) =>
    FILES.find((file) => file.id === Number(id)) ?? null;

/* `newsMock` importa DESTE arquivo (para montar as capas), então importar
   `newsMock` de volta no topo seria um ciclo — funciona por acidente em ESM e
   quebra no dia em que a ordem de carregamento mudar. O `import()` dinâmico
   só resolve quando a função roda, muito depois de os dois módulos já
   estarem carregados. */
const loadNewsUsage = async () => (await import('./newsMock')).newsUsingCover;

/* Acrescenta o que o backend calcula na resposta: o tipo (lá é uma coluna
   preenchida no upload; aqui, a mesma regra de `fileKind`) e quantos
   conteúdos usam o arquivo. */
const toOutput = (file, newsUsingCover) => ({
    ...clone(file),
    kind: fileKind(file).id,
    usageCount: newsUsingCover(file.id).length,
});

const matchesSearch = (file, term) =>
    file.name.toLowerCase().includes(term) || file.originalName.toLowerCase().includes(term);

export const reusableFileMockService = {
    /** Mesmos filtros do `GET /reusable-files?search=&kind=` real. */
    getPage: async ({ search, kind, page, size }) => {
        await delay();
        const newsUsingCover = await loadNewsUsage();
        const term = search?.trim().toLowerCase() ?? '';

        const matching = sorted()
            .filter((file) => !kind || kind === 'all' || fileKind(file).id === kind)
            .filter((file) => !term || matchesSearch(file, term))
            .map((file) => toOutput(file, newsUsingCover));

        return paginate(matching, { page, size });
    },

    getUsagesPage: async (id, { page, size }) => {
        await delay(300);
        const newsUsingCover = await loadNewsUsage();
        const usages = newsUsingCover(id).map((news) => ({ type: 'NEWS', id: news.id, title: news.title }));
        return paginate(usages, { page, size });
    },

    getById: async (id) => {
        await delay(250);
        const found = FILES.find((file) => file.id === Number(id));
        if (!found) throw new Error('Arquivo reutilizável não encontrado.');
        return toOutput(found, await loadNewsUsage());
    },

    create: async ({ file, name }) => {
        await delay(900);
        const originalName = file.name;
        const created = {
            id: nextId,
            // Espelha a regra do `ReusableFileService.save`: sem nome
            // informado, usa o nome do arquivo sem a extensão.
            name: name?.trim() || nameWithoutExtension(originalName),
            storedName: toStoredName(file),
            originalName,
            contentType: file.type || null,
            creationDate: new Date().toISOString().slice(0, 19),
        };
        nextId += 1;
        FILES = [created, ...FILES];
        return toOutput(created, await loadNewsUsage());
    },

    /* Renomear NÃO toca no arquivo — é `PUT /{id}` com JSON no backend.
       Manter as duas operações separadas é o que permite trocar o rótulo sem
       reenviar 3 MB de imagem. */
    rename: async (id, { name }) => {
        await delay(500);
        const index = FILES.findIndex((file) => file.id === Number(id));
        if (index === -1) throw new Error('Arquivo reutilizável não encontrado.');
        FILES = FILES.with(index, { ...FILES[index], name: name.trim() });
        return toOutput(FILES[index], await loadNewsUsage());
    },

    /* Trocar o arquivo MANTÉM o id — e portanto todas as notícias que já
       apontam para ele passam a mostrar a imagem nova. É o recurso que troca
       uma capa usada em dez notícias de uma vez só. */
    replaceFile: async (id, file) => {
        await delay(900);
        const index = FILES.findIndex((item) => item.id === Number(id));
        if (index === -1) throw new Error('Arquivo reutilizável não encontrado.');
        FILES = FILES.with(index, {
            ...FILES[index],
            storedName: toStoredName(file),
            originalName: file.name,
            contentType: file.type || null,
        });
        return toOutput(FILES[index], await loadNewsUsage());
    },

    /* No mock o `storedName` já é a URL do arquivo empacotado (ou um `blob:`
       de um upload feito na sessão): basta buscá-la. */
    download: async (id) => {
        await delay(400);
        const file = FILES.find((item) => item.id === Number(id));
        if (!file) throw new Error('Arquivo reutilizável não encontrado.');
        return (await fetch(file.storedName)).blob();
    },

    remove: async (id) => {
        await delay(700);
        const index = FILES.findIndex((file) => file.id === Number(id));
        if (index === -1) throw new Error('Arquivo reutilizável não encontrado.');

        /* Reproduz a regra do `ReusableFileService.delete`: o backend recusa
           apagar um arquivo em uso. A tela impede o clique antes disso, mas
           esta verificação é a rede de segurança para quando duas pessoas
           mexem no painel ao mesmo tempo. */
        const newsUsingCover = await loadNewsUsage();
        if (newsUsingCover(id).length > 0) {
            throw new Error(
                'Este arquivo está sendo usado como capa de uma ou mais notícias. ' +
                'Troque a capa dessas notícias antes de excluí-lo.'
            );
        }

        FILES = FILES.toSpliced(index, 1);
    },
};
