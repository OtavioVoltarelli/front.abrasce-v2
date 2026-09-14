import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Portão das rotas administrativas: sem login, ninguém passa daqui — nem
 * digitando o endereço direto na barra do navegador. (Isso protege a
 * EXPERIÊNCIA, não o dado: quem souber o endereço da API ainda esbarraria no
 * backend, que agora também exige o token — ver `SecurityConfig.java`. As
 * duas camadas têm papéis diferentes, e as duas precisam existir.)
 *
 * `<Outlet />` é onde o React Router encaixa a rota filha que bateu (ex.:
 * `AdminDashboard`) — é assim que um `PrivateRoute` protege QUALQUER rota
 * aninhada dentro dele, sem listar cada uma.
 *
 * `replace` no redirecionamento troca a entrada atual do histórico em vez de
 * empilhar outra: sem isso, o botão "voltar" do navegador devolveria a pessoa
 * pra rota protegida (vazia) antes do redirecionamento acontecer de novo —
 * um laço curto e confuso.
 */
export default function PrivateRoute() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
