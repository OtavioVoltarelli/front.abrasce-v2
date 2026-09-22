import { useState } from 'react';
import { AuthContext } from './authContext';
import { AUTH_STORAGE_KEY } from '../services/api';
import { isTokenExpired } from '../lib/jwt';

/**
 * Lê o que já estava salvo de uma visita anterior. `try/catch` porque um
 * JSON corrompido no localStorage (alguém editou na mão, versão antiga do
 * formato) não pode derrubar a aplicação inteira — melhor tratar como "não
 * tem ninguém logado" e deixar a pessoa entrar de novo.
 *
 * A checagem de `isTokenExpired` é o que evita a tela do admin desenhar por
 * um instante com um token vencido antes do redirecionamento pro login: sem
 * ela, "existe algo salvo" contava como "logado" até a primeira chamada de
 * API voltar 401 — o que é assíncrono, e por isso visível. Aqui a decisão é
 * síncrona, no mesmo render que o `PrivateRoute` usa pra deixar passar ou não.
 */
function readStoredAuth() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;

        const stored = JSON.parse(raw);
        if (isTokenExpired(stored.token)) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }

        return stored;
    } catch {
        return null;
    }
}

/**
 * Guarda "quem está logado" num lugar que qualquer componente da árvore
 * alcança via `useAuth()` (`hooks/useAuth.js`), sem precisar receber isso por
 * prop vindo lá de cima. É pra isso que serve um Context: um balde de dado
 * acessível de qualquer profundidade, sem repassar manualmente de pai pra
 * filho pra neto até chegar em quem precisa (o `PrivateRoute`, o botão de
 * logout no `AdminLayout`, a tela de `Login`... todos em pontos bem
 * diferentes da árvore).
 *
 * O ESTADO INICIAL JÁ LÊ O localStorage (`useState(readStoredAuth)`, não
 * `useState(null)`): é o que faz um F5 na página não deslogar ninguém. O
 * token em si não muda de lugar nenhum — ele já prova quem é a pessoa
 * sozinho, é só um texto assinado — só precisamos lembrar ONDE guardamos ele
 * entre uma visita e outra, e essa leitura acontece uma vez, no primeiro
 * render.
 */
export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(readStoredAuth);

    /** Chamado depois de um login bem-sucedido (`authService.login` já
     *  retornou). Só guarda o resultado — quem FEZ a chamada de rede foi
     *  `useLogin()`, em `hooks/useLogin.js`. Separar assim mantém a mesma
     *  fronteira do resto do projeto: hook de React Query cuida de rede,
     *  Context cuida de estado global da aplicação. */
    const login = (data) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
        setAuth(data);
    };

    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth(null);
    };

    const value = {
        user: auth ? { email: auth.email, role: auth.role } : null,
        isAuthenticated: Boolean(auth),
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
