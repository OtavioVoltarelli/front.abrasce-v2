import api from './api';
import { USE_MOCKS } from './config';
import { toPage } from './pagination';
import { onlyDigits } from '../lib/format';
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
    getPage: async ({ recruitmentProcessId, startDate, finalDate, page, size }) => {
        const { data } = await api.get('/candidates/recruitment-process', {
            params: { recruitmentProcessId, startDate, finalDate, page, size },
        });
        return toPage(data);
    },

    /**
     * O Spring recebe isto como duas @RequestPart: "data" com o JSON e "cv"
     * com o arquivo. O JSON PRECISA ir como Blob com type application/json —
     * sem isso o navegador manda text/plain e o Spring recusa com 415.
     */
    create: async ({ cv, cpf, cnpj, phoneNumber, ...rest }) => {
        // CPF, CNPJ e telefone vão SÓ COM DÍGITOS: é como o backend grava e
        // devolve. A máscara é da tela. CNPJ é opcional: vazio vai `null`.
        const candidateData = {
            ...rest,
            cpf: onlyDigits(cpf),
            cnpj: onlyDigits(cnpj) || null,
            phoneNumber: onlyDigits(phoneNumber),
        };

        const form = new FormData();
        form.append('data', new Blob([JSON.stringify(candidateData)], { type: 'application/json' }));
        // O currículo é opcional: sem arquivo, a parte "cv" nem vai — o
        // backend responde 201 com `cv: null`.
        if (cv) form.append('cv', cv);

        const { data } = await api.post('/candidates', form);
        return data;
    },

    /**
     * O arquivo do currículo, como Blob. A rota exige login, e por isso NÃO
     * pode ser um `<a href>`: quem segue um link é o navegador, que não sabe
     * do token guardado no localStorage — só o axios (pelo interceptor do
     * `api.js`) põe o `Authorization: Bearer` na requisição.
     */
    getCv: async (id) => {
        const { data } = await api.get(`/candidates/${id}/cv`, { responseType: 'blob' });
        return data;
    },
};

export const candidateService = USE_MOCKS ? candidateMockService : candidateHttpService;
