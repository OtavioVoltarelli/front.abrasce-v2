import './style.css';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import AlertModal from '../AlertModal';
import { sendContactForm } from '../../services/contactService';


const initialFormData = {
    name: '',
    email: '',
    phoneNumber: '',
    state: 'SP',
    city: '',
    message: ''
};

function Form() {
    const [formData, setFormData] = useState(initialFormData);

    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate();
    }

    const mutationFn = useCallback(
        () => sendContactForm(formData),
    [formData]);

    const { mutate, isPending } = useMutation({
        mutationFn,
        onSuccess: (data) => {
            setModal({
                isOpen: true,
                title: 'Sucesso!',
                message: data.message || 'Sua mensagem foi enviada com sucesso.'
            })
        },
        onError: (error) => {
            const message = error.message;
            setModal({
                isOpen: true,
                title: 'Erro',
                message
            })
        }
    })

    return (
        <>
            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ isOpen: false, title: '', message: '' })}
            />

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nome completo <span>(obrigatório)</span></label><br />
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                /><br />

                <label htmlFor="email">Email <span>(obrigatório)</span></label><br />
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                /><br />

                <label htmlFor="phoneNumber">Telefone <span>(obrigatório)</span></label><br />
                <input 
                    type="text" 
                    name="phoneNumber" 
                    id="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    placeholder="(xx) xxxxx-xxxx" 
                /><br />

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
                <input 
                    type="text" 
                    name="city" 
                    id="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                /><br />

                <label htmlFor="message">Mensagem <span>(obrigatório)</span></label><br />
                <textarea 
                    name="message" 
                    id="message" 
                    rows="6" 
                    value={formData.message} 
                    onChange={handleChange}
                ></textarea><br />

                <input
                    type="submit"
                    value={isPending ? 'Enviando...' : 'Enviar'}
                    disabled={isPending}
                />
            </form>
        </>
    );
}

export default Form;
