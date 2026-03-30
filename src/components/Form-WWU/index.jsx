import './style.css';
import React, { useState, useEffect } from 'react';
import CONFIG from '../../config';

function Form() {
    const [recruitmentProcesses, setRecruitmentProcesses] = useState([]);
    const [formData, setFormData] = useState({
        recruitmentProcessId: '',
        name: '',
        email: '',
        number: '',
        companyName: '',
        cnpj: '',
        state: 'SP',
        city: '',
        cvUrl: null
    });

    useEffect(() => {
        fetch(`${CONFIG.API_URL}recruitment-process/actives`)
            .then((response) => response.json())
            .then((data) => { 
                setRecruitmentProcesses(data);
            })
            .catch((error) => console.error('Erro ao buscar processos seletivos:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { recruitmentProcessId, name, email, number, companyName, cnpj, state, city, cvUrl } = formData;

        // verifica se o recruitmentProcessId está preenchido corretamente
        if (!recruitmentProcessId) {
            alert('Por favor, selecione um processo seletivo.');
            return;
        }

        const candidateData = {
            recruitmentProcessId,
            name,
            email,
            number,
            companyName,
            cnpj,
            state,
            city
        };

        try {
            // cria o candidato sem o CV, para gerar um id
            const candidateResponse = await fetch(`${CONFIG.API_URL}candidates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(candidateData)
            });

            if (!candidateResponse.ok) {
                throw new Error('Erro ao criar candidato');
            }
            // é a resposta do backend (informacoes do candidate criado)
            const candidate = await candidateResponse.json();

            console.log('Arquivo selecionado:', cvUrl);

            // verifica se o cvUrl foi selecionado antes de enviar
            if (cvUrl) {
                const formDataForCV = new FormData();
                formDataForCV.append('file', cvUrl);

                const uploadResponse = await fetch(`${CONFIG.API_URL}candidates/${candidate.id}/upload-cv`, {
                    method: 'POST',
                    body: formDataForCV,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!uploadResponse.ok) {
                    throw new Error('Erro ao enviar currículo');
                }

                console.log('Currículo enviado com sucesso');
            }

            alert('Candidatura realizada com sucesso!');
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao processar a solicitação. Caso o arquivo anexado for maior ou igual a 1Mb, por favor tente compacta-lo para poder concluir sua inscrição.');
        }
    };

    return (
        <form onSubmit={handleSubmit}  method="POST" encType="multipart/form-data" autoComplete="off">
            <label htmlFor="recruitmentProcessId">Processo seletivo <span>(obrigatório)</span></label><br />
            <select 
                name="recruitmentProcessId" 
                id="recruitmentProcessId" 
                value={formData.recruitmentProcessId} 
                onChange={handleChange} 
                required
            >
                <option value="" disabled>Selecione um processo</option>
                {recruitmentProcesses.map((process) => (
                    <option key={process.id} value={process.id}>
                        {process.title}
                    </option>
                ))}
            </select><br />

            <label htmlFor="name">Nome completo <span>(obrigatório)</span></label><br />
            <input 
                type="text" 
                name="name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required
            /><br />

            <label htmlFor="email">Email <span>(obrigatório)</span></label><br />
            <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
            /><br />

            <label htmlFor="number">Telefone <span>(obrigatório)</span></label><br />
            <input 
                type="number" 
                name="number" 
                id="number" 
                value={formData.number} 
                onChange={handleChange} 
                placeholder="xxxxxxxxxx" 
                required
            /><br />

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
            /><br />

            <label htmlFor="state">Estado</label><br />
            <select 
                name="state" 
                id="state" 
                value={formData.state} 
                onChange={handleChange} 
                required
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
                required
            /><br />

            <label htmlFor="cvUrl">Envie seu currículo <span>(obrigatório)</span><br /><span>Tamanho máximo permitido do arquivo:  1 MB</span></label><br />
            <input 
                type="file" 
                name="cvUrl" 
                id="cvUrl" 
                onChange={handleChange} 
                required
            /><br />

            <input type="submit" value="Enviar" />
        </form>
    );
}

export default Form;
