import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Chave única no localStorage onde o `AuthContext` guarda `{ token, email, role }`.
 * Exportada daqui (e não definida de novo no AuthContext) porque as duas pontas —
 * quem SALVA o token e quem LÊ pra montar o header — precisam concordar no mesmo
 * nome de chave, e este arquivo é o único dos dois que o outro lado importa sem
 * criar dependência circular.
 */
export const AUTH_STORAGE_KEY = 'abrasce:auth';

/**
 * INTERCEPTOR DE REQUISIÇÃO: gruda `Authorization: Bearer <token>` em toda
 * chamada, automaticamente — sempre que houver um token guardado.
 *
 * Sem isso, cada um dos 8 services (`newsService`, `candidateService`...)
 * precisaria lembrar de ler o token e montar o header na mão. Um esquecimento
 * e a tela quebra em 401 sem aviso — e como o backend agora protege quase
 * tudo por padrão (`anyRequest().authenticated()`), esquecer aconteceria toda
 * hora. Com o interceptor, é uma regra só, aplicada sempre.
 *
 * Lê direto do localStorage (não de um estado do React) de propósito: este
 * arquivo roda fora da árvore de componentes, antes de qualquer um montar —
 * não existe "estado do React" pra ler aqui, só o que está persistido.
 */
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);

    // `try/catch` pelo mesmo motivo do `readStoredAuth` em `AuthProvider.jsx`:
    // um JSON corrompido não pode derrubar a chamada. A diferença é que ALI a
    // leitura acontece uma vez, no primeiro render; AQUI acontece em toda
    // requisição — sem o catch, um valor inválido quebraria a promise antes
    // dela sair para a rede, nunca chegando no interceptor de resposta (que é
    // quem trata 401 e manda para o login).
    if (stored) {
        try {
            const { token } = JSON.parse(stored);
            config.headers.Authorization = `Bearer ${token}`;
        } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }

    return config;
});

/**
 * INTERCEPTOR DE RESPOSTA: dois trabalhos, sempre que uma chamada falha.
 *
 * 1. TRADUZ o erro do backend pra `error.message`. Toda rota de erro da API
 *    devolve um `ProblemDetail` — `{ detail: "E-mail ou senha inválidos." }` —
 *    mas por padrão o axios não sabe disso, e `error.message` viria genérico
 *    ("Request failed with status code 401"). Todo formulário do site já lê
 *    `mutation.error?.message` (ver `ContactForm`); com isso aqui, todos eles
 *    passam a mostrar a mensagem de verdade sem precisar mudar nada.
 *
 * 2. Em qualquer 401 que NÃO seja o próprio `/auth/login` — senha errada não é
 *    "sessão expirou", são coisas diferentes — limpa o token guardado e manda
 *    a pessoa pra tela de login. É o que acontece se o token vencer (8h) no
 *    meio do uso: a próxima chamada volta 401, e em vez da tela travar com uma
 *    mensagem técnica, a pessoa cai direto no login de novo.
 *
 *    `window.location.href` (recarga completa) e não `navigate()` do React
 *    Router de propósito: este interceptor roda fora de qualquer componente,
 *    então não tem acesso ao `navigate`. A recarga também zera todo estado da
 *    aplicação de uma vez — inclusive o cache do React Query, que a esta
 *    altura pode ter dado de outra pessoa.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const detail = error.response?.data?.detail;
        if (detail) error.message = detail;

        const isLoginRequest = error.config?.url?.includes('/auth/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
