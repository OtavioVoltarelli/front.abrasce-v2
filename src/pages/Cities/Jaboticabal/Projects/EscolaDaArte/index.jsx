import CONFIG from '../../../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function EscolaDaArte() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'EaC', url: `${CONFIG.API_URL}pdf/jaboticabal/escoladaarte/contratos` },
            { id: 'Ea2023Eb', url: `${CONFIG.API_URL}pdf/jaboticabal/escoladaarte/2023/extratosbancarios` },
            { id: 'Ea2023Cb', url: `${CONFIG.API_URL}pdf/jaboticabal/escoladaarte/2023/conciliacaobancaria` },

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
            <h1>Jaboticabal - SP</h1>
            <h2>Escola da Arte</h2>
            <h3>Contratos</h3>
            <ul>
                {pdfData.EaC && pdfData.EaC.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}jaboticabal/escoladaarte/contratos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2023</h3>
            <h4>- Extrato Bancário</h4>
            <ul>
                {pdfData.Ea2023Eb && pdfData.Ea2023Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}jaboticabal/escoladaarte/2023/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Ea2023Cb && pdfData.Ea2023Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}jaboticabal/escoladaarte/2023/conciliacaobancaria/${pdf}`} 
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

export default EscolaDaArte;
