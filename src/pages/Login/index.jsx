import CONFIG from '../../config';
import './style.css';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import Cookies from 'js-cookie';

function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 
    const { login: loginContext } = useContext(AuthContext); 

    
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            navigate("/area-restrita");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault(); 
        console.log("Login iniciado...");

        const response = await fetch(`${CONFIG.API_URL}auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, password }),
            credentials: 'include'
        });

        console.log("Requisição enviada...");

        if (response.ok) {
            const data = await response.json();
            const token = data.token;

            Cookies.set("token", token, { 
                expires: 7,
                path: "/",
                secure: false, 
                sameSite: "strict"
            });

            loginContext(data.token);

            console.log("Login bem-sucedido, redirecionando...");
            navigate("/area-restrita");
        } else {
            alert("Usuário ou senha inválidas.");
        }
    };

    return (
        <main id='login'>
            <article id='login-title'>
                <h2>Login</h2>
            </article>
            <article id='login-form'>
                <form onSubmit={handleLogin}>
                    <input 
                        type="text" 
                        placeholder="Usuário" 
                        value={login} 
                        onChange={(e) => setLogin(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button type="submit">Entrar</button>
                </form>
            </article>
        </main>
    );
}

export default Login;
