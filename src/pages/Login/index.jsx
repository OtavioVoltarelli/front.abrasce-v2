import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/layout/Logo';
import { useAuth } from '../../hooks/useAuth';
import { useLogin } from '../../hooks/useLogin';

/**
 * Login do painel administrativo. Fica FORA de `PublicLayout` e `AdminLayout`
 * de propósito — não tem navbar/rodapé do site (a pessoa ali não está
 * "navegando"), nem a barra do painel (ela ainda não entrou).
 *
 * Validação client-side é só o `required` + `type="email"` nativos do HTML —
 * dois campos não pedem a mesma infraestrutura de validação do `ContactForm`.
 * O que realmente decide "essa senha está certa?" é sempre o backend; a
 * mensagem de erro que aparece aqui (`mutation.error?.message`) já vem
 * traduzida do `ProblemDetail` pelo interceptor do `api.js`.
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { isAuthenticated, login } = useAuth();
    const mutation = useLogin();
    const navigate = useNavigate();

    // Já logado e voltou pra /login (endereço digitado, aba antiga)? Não
    // mostra o formulário de novo — manda direto pro painel.
    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        mutation.mutate(
            // `trim()`: o autocompletar do teclado do celular insere o e-mail
            // com um espaço no fim, e o servidor recusava "admin@x.com " como
            // conta inexistente — a pessoa via "senha inválida" com a senha certa.
            { email: email.trim(), password },
            {
                // `login(data)` só roda se a API confirmar as credenciais —
                // é o `AuthContext` que persiste o token e navega, não este
                // componente diretamente, pra manter as duas responsabilidades
                // (chamar a API vs. guardar o resultado) em lugares separados.
                onSuccess: (data) => {
                    login(data);
                    navigate('/admin', { replace: true });
                },
            }
        );
    };

    return (
        <div className="flex min-h-dvh items-center justify-center bg-sand px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex justify-center">
                    <Logo />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-line sm:p-8">
                    <h1 className="text-xl text-ink-900">Entrar no painel</h1>
                    <p className="mt-1 text-sm text-muted">
                        Acesso restrito à equipe da ABRASCE.
                    </p>

                    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                        {mutation.isError && (
                            <div role="alert" className="rounded-xl bg-red-50 p-4 ring-1 ring-red-200">
                                <p className="text-sm font-medium text-red-700">
                                    {mutation.error?.message ?? 'Não foi possível entrar. Tente novamente.'}
                                </p>
                            </div>
                        )}

                        <Input
                            label="E-mail"
                            required
                            type="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            inputMode="email"
                            autoFocus
                        />

                        <Input
                            label="Senha"
                            required
                            type="password"
                            name="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                        />

                        <Button type="submit" fullWidth disabled={mutation.isPending}>
                            {mutation.isPending ? 'Entrando…' : 'Entrar'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
