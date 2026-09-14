import { createContext } from 'react';

/**
 * O Context em si — só o "balde" vazio, sem Provider nem hook.
 *
 * Fica separado de `AuthProvider.jsx` (o componente) e `hooks/useAuth.js` (o
 * hook que lê ele) porque o ESLint (`react-refresh/only-export-components`)
 * exige que um arquivo com um componente React só exporte componentes — é o
 * que permite o Fast Refresh do Vite trocar um componente editado na tela sem
 * perder o estado do app inteiro e recarregar a página toda. Três papéis,
 * três arquivos.
 */
export const AuthContext = createContext(null);
