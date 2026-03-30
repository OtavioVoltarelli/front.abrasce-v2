import { useEffect, useState } from "react";
import "./style.css";
import CONFIG from "../../config";
import Cookies from "js-cookie"; // Importa a biblioteca de cookies

function ContactManagement() {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");

    // Recupera o token do cookie
    const token = Cookies.get("token");

    useEffect(() => {
        // Verifica se o token existe
        if (!token) {
            alert("Usuário não autenticado. Redirecionando para login...");
            // Redireciona para a página de login
            window.location.href = "/login";
            return;
        }

        // Faz a requisição com o token no cabeçalho
        fetch(`${CONFIG.API_URL}contacts`, {
            headers: {
                "Authorization": `Bearer ${token}` // Inclui o token no cabeçalho
            }
        })
            .then(response => {
                if (response.status === 401) {
                    // Token inválido ou expirado
                    alert("Sessão expirada. Faça login novamente.");
                    Cookies.remove("token"); // Remove o token inválido
                    window.location.href = "/login"; // Redireciona para a página de login
                    return;
                }
                return response.json();
            })
            .then(data => setContacts(Array.isArray(data) ? data : []))
            .catch(error => {
                console.error("Erro ao buscar contatos:", error);
            });
    }, [token]); // Dependência do token para refazer a requisição se o token mudar

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main id="contact-management">
            <article id="title">
                <h1>Contatos</h1>
            </article>
            <input
                id="search"
                type="text"
                placeholder="Pesquisar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filteredContacts.length > 0 ? (
                <article id="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Telefone</th>
                                <th>Cidade</th>
                                <th>Estado</th>
                                <th>Data</th>
                                <th>Mensagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact, index) => (
                                <tr key={index}>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.number}</td>
                                    <td>{contact.city}</td>
                                    <td>{contact.state}</td>
                                    <td>{contact.localDate}</td>
                                    <td>{contact.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </article>
            ) : (
                <p>Nenhum contato encontrado.</p>
            )}
        </main>
    );
}

export default ContactManagement;