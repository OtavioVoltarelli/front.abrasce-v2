import CONFIG from '../../../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function VilaJulia() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'VjTf', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/termofomento` },
            { id: 'Vj2020Eb', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/2020/extratosbancarios` },
            { id: 'Vj2020Bl', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/2020/balanco` },
            { id: 'Vj2019Eb', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/2019/extratosbancarios` },
            { id: 'Vj2019Bl', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/2019/balanco` },
            { id: 'Vj2019R', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/2019/relatorio` },
            { id: 'Vj2019Cb', url: `${CONFIG.API_URL}pdf/guaruja/vilajulia/2019/conciliacaobancaria` },
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
            <h2>Vila Julia</h2>
            <h3>Termo Fomento</h3>
            <ul>
                {pdfData.VjTf && pdfData.VjTf.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/termofomento/${pdf}`} 
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
                {pdfData.Vj2020Eb && pdfData.Vj2020Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Balanço</h4>
            <ul>
                {pdfData.Vj2020Bl && pdfData.Vj2020Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/2020/balanco/${pdf}`} 
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
                {pdfData.Vj2019Eb && pdfData.Vj2019Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Balanço</h4>
            <ul>
                {pdfData.Vj2019Bl && pdfData.Vj2019Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Conciliação Bancária</h4>
            <ul>
                {pdfData.Vj2019Cb && pdfData.Vj2019Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/2019/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>Relatório</h4>
            <ul>
                {pdfData.Vj2019R && pdfData.Vj2019R.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}guaruja/vilajulia/2019/relatorio/${pdf}`} 
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

export default VilaJulia;
