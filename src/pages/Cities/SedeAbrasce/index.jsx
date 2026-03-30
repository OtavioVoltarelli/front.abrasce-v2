import CONFIG from '../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function SedeAbrasce() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'SaR', url: `${CONFIG.API_URL}pdf/sedeabrasce/relatorios` },
            { id: 'SaRg', url: `${CONFIG.API_URL}pdf/sedeabrasce/regulamentos` },
            { id: 'SaOd', url: `${CONFIG.API_URL}pdf/sedeabrasce/outrosdocumentos` },
            { id: 'SaE', url: `${CONFIG.API_URL}pdf/sedeabrasce/estatuto` },
            { id: 'SaCTf', url: `${CONFIG.API_URL}pdf/sedeabrasce/contratostermosdefomento` },
            { id: 'SaC', url: `${CONFIG.API_URL}pdf/sedeabrasce/certidoes` },
            { id: 'SaBl', url: `${CONFIG.API_URL}pdf/sedeabrasce/balancos` },
            { id: 'SaA', url: `${CONFIG.API_URL}pdf/sedeabrasce/atas` },

        ];


        const fetchApis = async () => {
            try {
                const results = await Promise.all(
                    endpoints.map(endpoint =>
                        fetch(endpoint.url).then(res => res.json())
                    )
                );

                const newPdfData = {};
                results.forEach((response, index) => {
                    const endpointId = endpoints[index].id;
                    newPdfData[endpointId] = response;
                });
                setPdfData(newPdfData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApis();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div id="cidade-projeto">
            <h1>Sede - Abrasce Social</h1>
            <h3>Relatórios</h3>
            <ul>
                {pdfData.SaR && pdfData.SaR.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/relatorios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Regulamentos</h3>
            <ul>
                {pdfData.SaRg && pdfData.SaRg.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/regulamentos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Outros Documentos</h3>
            <ul>
                {pdfData.SaOd && pdfData.SaOd.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/outrosdocumentos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Estatuto</h3>
            <ul>
                {pdfData.SaE && pdfData.SaE.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/estatuto/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Contratos / Termos de Fomento</h3>
            <ul>
                {pdfData.SaCTf && pdfData.SaCTf.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/contratostermosdefomento/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Certidões</h3>
            <ul>
                {pdfData.SaC && pdfData.SaC.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/certidoes/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Balanços</h3>
            <ul>
                {pdfData.SaBl && pdfData.SaBl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/balancos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Atas</h3>
            <ul>
                {pdfData.SaA && pdfData.SaA.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}sedeabrasce/atas/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SedeAbrasce;
