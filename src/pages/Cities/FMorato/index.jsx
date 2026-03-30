import CONFIG from '../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function FMorato() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'FmC', url: `${CONFIG.API_URL}pdf/fmorato/contratos` },
            { id: 'Fm2026Eb', url: `${CONFIG.API_URL}pdf/fmorato/2026/extratosbancarios` },
            { id: 'Fm2026Cb', url: `${CONFIG.API_URL}pdf/fmorato/2026/conciliacaobancaria` },
            { id: 'Fm2025Eb', url: `${CONFIG.API_URL}pdf/fmorato/2025/extratosbancarios` },
            { id: 'Fm2025Cb', url: `${CONFIG.API_URL}pdf/fmorato/2025/conciliacaobancaria` },
            { id: 'Fm2024Eb', url: `${CONFIG.API_URL}pdf/fmorato/2024/extratosbancarios` },
            { id: 'Fm2024Cb', url: `${CONFIG.API_URL}pdf/fmorato/2024/conciliacaobancaria` },
            { id: 'Fm2023Eb', url: `${CONFIG.API_URL}pdf/fmorato/2023/extratosbancarios` },
            { id: 'Fm2023Cb', url: `${CONFIG.API_URL}pdf/fmorato/2023/conciliacaobancaria` },
            { id: 'Fm2023Rt', url: `${CONFIG.API_URL}pdf/fmorato/2023/relatoriostrimestrais` },
            { id: 'Fm2023Pc', url: `${CONFIG.API_URL}pdf/fmorato/2023/prestacaodecontas` },
            { id: 'Fm2023Ps', url: `${CONFIG.API_URL}pdf/fmorato/2023/pesquisadesatisfacao` },
            { id: 'Fm2022Eb', url: `${CONFIG.API_URL}pdf/fmorato/2022/extratosbancarios` },
            { id: 'Fm2022Cb', url: `${CONFIG.API_URL}pdf/fmorato/2022/conciliacaobancaria` },
            { id: 'Fm2022Rt', url: `${CONFIG.API_URL}pdf/fmorato/2022/relatoriostrimestrais` },
            { id: 'Fm2022Ra', url: `${CONFIG.API_URL}pdf/fmorato/2022/relatoriosanuais` },
            { id: 'Fm2022Bl', url: `${CONFIG.API_URL}pdf/fmorato/2022/balanco` },
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
        <div id="fmorato">
            <h1>Francisco Morato - SP</h1>
            <h3>Contratos</h3>
            <ul>
                {pdfData.FmC && pdfData.FmC.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/contratos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2026</h3>
            <h4>- Extrato Bancário</h4>
            <ul>
                {pdfData.Fm2026Eb && pdfData.Fm2026Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2026/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Fm2026Cb && pdfData.Fm2026Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2026/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2025</h3>
            <h4>- Extrato Bancário</h4>
            <ul>
                {pdfData.Fm2025Eb && pdfData.Fm2025Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2025/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Fm2025Cb && pdfData.Fm2025Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2025/conciliacaobancaria/${pdf}`} 
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
                {pdfData.Fm2024Eb && pdfData.Fm2024Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2024/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Fm2024Cb && pdfData.Fm2024Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2024/conciliacaobancaria/${pdf}`} 
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
                {pdfData.Fm2023Eb && pdfData.Fm2023Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2023/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Fm2023Cb && pdfData.Fm2023Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2023/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Trimestrais</h4>
            <ul>
                {pdfData.Fm2023Rt && pdfData.Fm2023Rt.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2023/relatoriostrimestrais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Prestação de Contas</h4>
            <ul>
                {pdfData.Fm2023Pc && pdfData.Fm2023Pc.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2023/prestacaodecontas/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Pesquisas de Satisfação</h4>
            <ul>
                {pdfData.Fm2023Ps && pdfData.Fm2023Ps.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2023/pesquisadesatisfacao/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2022</h3>
            <h4>- Extrato Bancário</h4>
            <ul>
                {pdfData.Fm2022Eb && pdfData.Fm2022Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2022/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Fm2022Cb && pdfData.Fm2022Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2022/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Trimestrais</h4>
            <ul>
                {pdfData.Fm2022Rt && pdfData.Fm2022Rt.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2022/relatoriostrimestrais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.Fm2022Ra && pdfData.Fm2022Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2022/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.Fm2022Bl && pdfData.Fm2022Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}fmorato/2022/balanco/${pdf}`} 
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

export default FMorato;
