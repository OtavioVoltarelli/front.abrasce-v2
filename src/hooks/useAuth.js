import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

/** Atalho pra ler o `AuthContext`, com uma checagem que evita um bug
 *  silencioso: sem o `if`, usar `useAuth()` fora de um `<AuthProvider>`
 *  devolveria `null` e o erro só apareceria páginas depois, ao tentar ler
 *  `.isAuthenticated` de `null` — uma mensagem confusa, longe da causa real. */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>.');
    }

    return context;
}
