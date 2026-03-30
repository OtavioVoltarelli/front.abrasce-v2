import CONFIG from '../../../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function AssistenciaSocial() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'As', url: `${CONFIG.API_URL}pdf/guaruja/assistenciasocial` },
            { id: 'As2020B', url: `${CONFIG.API_URL}pdf/guaruja/assistenciasocial/2020/balanco` },
            { id: 'As2019B', url: `${CONFIG.API_URL}pdf/guaruja/assistenciasocial/2019/balanco` },
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
            <h1>Guarujá - SP</h1>
            <h2>Assistência Social</h2>
            <ul>
                {pdfData.As && pdfData.As.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/assistenciasocial/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2020</h3>
            <h4>Balanço</h4>
            <ul>
                {pdfData.As2020B && pdfData.As2020B.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/assistenciasocial/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2019</h3>
            <h4>Balanço</h4>
            <ul>
                {pdfData.As2019B && pdfData.As2019B.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/assistenciasocial/2019/balanco/${pdf}`} 
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

export default AssistenciaSocial;
