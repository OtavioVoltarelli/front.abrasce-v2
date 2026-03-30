import './style.css';
import { useState } from 'react';
import CONFIG from '../../config';

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        state: 'SP',
        city: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // envia os dados para o back
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${CONFIG.API_URL}contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Enviado com sucesso!');
                setFormData({ name: '', email: '', number: '', state: 'SP', city: '', message: '' }); // limpa o formulário
            } else {
                alert('Erro ao enviar');
            }
        } catch (error) {
            console.error('Erro ao enviar', error);
            alert('Erro ao enviar.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nome completo <span>(obrigatório)</span></label><br />
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} /><br />

            <label htmlFor="email">Email <span>(obrigatório)</span></label><br />
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} /><br />

            <label htmlFor="tel">Telefone <span>(obrigatório)</span></label><br />
            <input type="number" name="number" id="number" value={formData.number} onChange={handleChange} placeholder="(xx) xxxxx-xxxx" /><br />

            <label htmlFor="state">Estado</label><br />
            <select name="state" id="state" value={formData.state} onChange={handleChange}>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
            </select><br />

            <label htmlFor="city">Cidade</label><br />
            <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} /><br />

            <label htmlFor="message">Mensagem <span>(obrigatório)</span></label><br />
            <textarea name="message" id="message" rows="6" value={formData.message} onChange={handleChange}></textarea><br />

            <button type="submit">Enviar</button>
        </form>
    );
}

export default Form;
