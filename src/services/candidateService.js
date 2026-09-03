import api from './api';
import { USE_MOCKS } from './config';
import { candidateMockService } from '../mocks/candidateMock';

/**
 * Candidatos — endpoints reais (`CandidateController`):
 *   GET  /api/candidates/recruitment-process?recruitmentProcessId&startDate&finalDate
 *   POST /api/candidates    multipart: parte "data" (JSON) + parte "cv" (arquivo)
 *   GET  /api/candidates/{id}/cv
 *
 * O código antigo chamava `/candidates/process/{id}`, que não existe no
 * backend v2, e lia campos com nomes errados (`number` em vez de
 * `phoneNumber`, `candidationDate` em vez de `candidateDate`).
 */
const candidateHttpService = {
    // Também paginado (PagedModel) — mesma gambiarra de `size=100` do
    // newsService/contactService/recruitmentProcessService até a tela ganhar
    // paginação de verdade.
    findByFilter: async ({ recruitmentProcessId, startDate, finalDate }) => {
        const { data } = await api.get('/candidates/recruitment-process', {
            params: { recruitmentProcessId, startDate, finalDate, size: 100 },
        });
        return data.content ?? [];
    },

    /**
     * O Spring recebe isto como duas @RequestPart: "data" com o JSON e "cv"
     * com o arquivo. O JSON PRECISA ir como Blob com type application/json —
     * sem isso o navegador manda text/plain e o Spring recusa com 415.
     */
    create: async ({ cv, ...candidateData }) => {
        const form = new FormData();
        form.append('data', new Blob([JSON.stringify(candidateData)], { type: 'application/json' }));
        form.append('cv', cv);

        const { data } = await api.post('/candidates', form);
        return data;
    },
};

export const candidateService = USE_MOCKS ? candidateMockService : candidateHttpService;
