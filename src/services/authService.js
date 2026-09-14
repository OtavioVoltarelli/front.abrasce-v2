import api from './api';

/**
 * Autenticação — `AuthController` do backend v2.
 *
 *   POST /api/auth/login   JSON puro: { email, password } → { token, email, role }
 *
 * O token é um JWT (JSON Web Token): um texto assinado pelo backend que carrega
 * dentro dele quem é a pessoa (`email`) e seu papel (`role`). O backend é STATELESS
 * — não guarda sessão nenhuma — então é este token, reenviado em toda requisição
 * futura, que prova "estou logado". Quem guarda o token e reenvia é o `AuthContext`
 * + o interceptor do `api.js` (próximos passos).
 *
 * ---------------------------------------------------------------------------
 * SEM MODO MOCK AQUI, DIFERENTE DE TODO OUTRO SERVICE
 * ---------------------------------------------------------------------------
 * Dá pra fingir uma lista de notícias; não dá pra fingir "esta senha está certa"
 * sem duplicar a lógica de autenticação do backend dentro do front — e isso seria
 * pior que não ter mock nenhum, porque criaria dois lugares decidindo quem pode
 * entrar. Consequência real: com `VITE_USE_MOCKS=true`, o site público continua
 * funcionando igual a hoje, mas o painel administrativo fica inacessível (sem
 * login de verdade, `PrivateRoute` nunca tem token pra mostrar). Se um dia isso
 * incomodar — por exemplo, pra demonstrar o admin sem subir o backend — dá pra
 * resolver com um login mock que aceita qualquer senha, mas não quis inventar essa
 * peça sem alguém pedir.
 */
export const authService = {
    login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    },
};
