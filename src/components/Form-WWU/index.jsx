import './style.css';
import React, { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import AlertModal from '../AlertModal';
import { createCandidate } from '../../services/candidateService';
import { validateForm } from '../../validations/candidateValidation';    

const INITIAL_FORM_DATA = {
    name: '',
    email: '',
    phoneNumber: '',
    cpf: '',
    companyName: '',
    cnpj: '',
    state: 'SP',
    city: '',
    cvUrl: null
};

function CandidationForm({ recruitmentProcessId }) {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: ''
    });

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // Erros de validação por campo
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        // Limpa o erro do campo ao começar a editar
        setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }, []);

    // Lógica de criação isolada em service — useCallback evita recriação desnecessária
    const mutationFn = useCallback(
        () => createCandidate({ ...formData, recruitmentProcessId }),
        [formData, recruitmentProcessId]
    );

    const { mutate, isPending } = useMutation({
        mutationFn,
        onSuccess: (data) => {
            setModal({
                isOpen: true,
                title: 'Sucesso!',
                message: data.message || 'Sua candidatura foi enviada com sucesso.'
            });
            setFormData(INITIAL_FORM_DATA); // usa a constante — sem duplicação
            setFieldErrors({});
        },
        onError: (error) => {

            setModal({
                isOpen: true,
                title: 'Erro!',
                message: error.message || 'Ocorreu um erro ao enviar sua candidatura. Tente novamente.'
            });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return; // interrompe sem chamar a API
        }

        mutate();
    };

    return (
        <>
            <AlertModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ isOpen: false, title: '', message: '' })}
            />

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>

                <label htmlFor="name">Nome completo <span>(obrigatório)</span></label><br />
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}

                <label htmlFor="email">Email <span>(obrigatório)</span></label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                <br />

                {/* Corrigido: name era "number", agora é "phoneNumber" alinhado ao estado */}
                <label htmlFor="phoneNumber">Telefone <span>(obrigatório)</span></label><br />
                <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="xx xxxxxxxxx"
                />
                {fieldErrors.phoneNumber && <span className="field-error">{fieldErrors.phoneNumber}</span>}
                <br />

                <label htmlFor="cpf">CPF <span>(obrigatório)</span></label><br />
                <input
                    type="text"
                    name="cpf"
                    id="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="xxx.xxx.xxx-xx"
                />
                {fieldErrors.cpf && <span className="field-error">{fieldErrors.cpf}</span>}
                <br />

                <label htmlFor="companyName">Razão Social</label><br />
                <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                /><br />

                <label htmlFor="cnpj">CNPJ</label><br />
                <input
                    type="text"
                    name="cnpj"
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                />
                {fieldErrors.cnpj && <span className="field-error">{fieldErrors.cnpj}</span>}
                <br />

                <label htmlFor="state">Estado</label><br />
                <select
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                >
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

                <label htmlFor="city">Cidade <span>(obrigatório)</span></label><br />
                <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
                <br />

                <label htmlFor="cvUrl">
                    Envie seu currículo <span>(obrigatório)</span><br />
                    <span>Tamanho máximo permitido do arquivo: 1 MB</span>
                </label><br />
                <input
                    type="file"
                    name="cvUrl"
                    id="cvUrl"
                    onChange={handleChange}
                />
                {fieldErrors.cvUrl && <span className="field-error">{fieldErrors.cvUrl}</span>}
                <br />

                <input
                    type="submit"
                    value={isPending ? 'Enviando...' : 'Enviar'}
                    disabled={isPending}
                />
            </form>
        </>
    );
}

export default CandidationForm;
