import CONFIG from '../../../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function Pereque() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'PTf', url: `${CONFIG.API_URL}pdf/guaruja/pereque/termofomento` },
            { id: 'P2020Eb', url: `${CONFIG.API_URL}pdf/guaruja/pereque/2020/extratosbancarios` },
            { id: 'P2020Bl', url: `${CONFIG.API_URL}pdf/guaruja/pereque/2020/balanco` },
            { id: 'P2019Eb', url: `${CONFIG.API_URL}pdf/guaruja/pereque/2019/extratosbancarios` },
            { id: 'P2019Bl', url: `${CONFIG.API_URL}pdf/guaruja/pereque/2019/balanco` },
            { id: 'P2019R', url: `${CONFIG.API_URL}pdf/guaruja/pereque/2019/relatorios` },
            { id: 'P2019Cb', url: `${CONFIG.API_URL}pdf/guaruja/pereque/2019/conciliacaobancaria` },
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
            <h2>Pereque</h2>
            <h3>Termo Fomento</h3>
            <ul>
                {pdfData.PTf && pdfData.PTf.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/termofomento/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2020</h3>
            <h4>Extratos Bancários</h4>
            <ul>
                {pdfData.P2020Eb && pdfData.P2020Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Balanço</h4>
            <ul>
                {pdfData.P2020Bl && pdfData.P2020Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2019</h3>
            <h4>Extratos Bancários</h4>
            <ul>
                {pdfData.P2019Eb && pdfData.P2019Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Balanço</h4>
            <ul>
                {pdfData.P2019Bl && pdfData.P2019Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Conciliação Bancária</h4>
            <ul>
                {pdfData.P2019Cb && pdfData.P2019Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/2019/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Relatório</h4>
            <ul>
                {pdfData.P2019R && pdfData.P2019R.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/pereque/2019/relatorios/${pdf}`} 
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

export default Pereque;
