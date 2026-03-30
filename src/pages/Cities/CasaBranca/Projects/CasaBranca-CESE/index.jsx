import './style.css';
import React, { useEffect, useState } from 'react';
import CONFIG from '../../../../../config';

function CasaBrancaCESE() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'cTc', url: `${CONFIG.API_URL}pdf/casabranca/cese/termodecolaboracao` },
            { id: 'c2024Eb', url: `${CONFIG.API_URL}pdf/casabranca/cese/2024/extratosbancarios` },
            { id: 'c2024Cb', url: `${CONFIG.API_URL}pdf/casabranca/cese/2024/conciliacaobancaria` },
            { id: 'c2023Eb', url: `${CONFIG.API_URL}pdf/casabranca/cese/2023/extratosbancarios` },
            { id: 'c2023Cb', url: `${CONFIG.API_URL}pdf/casabranca/cese/2023/conciliacaobancaria` },
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
        <div id="casa-branca">
            <h1>Casa Branca - SP</h1>
            <h2>CESE</h2>
            <h3>Termo de Colaboração</h3>
            <ul>
                {pdfData.cTc && pdfData.cTc.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/cese/termodecolaboracao/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2024</h3>
            <h4>- Extrato Bancário</h4>
            <ul>
                {pdfData.c2024Eb && pdfData.c2024Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/cese/2024/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.c2024Cb && pdfData.c2024Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/cese/2024/conciliacaobancaria/${pdf}`} 
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
                {pdfData.c2023Eb && pdfData.c2023Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/cese/2023/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.c2023Cb && pdfData.c2023Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/cese/2023/conciliacaobancaria/${pdf}`} 
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

export default CasaBrancaCESE;
