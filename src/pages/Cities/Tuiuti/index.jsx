import CONFIG from '../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function Tuiuti() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'TC', url: `${CONFIG.API_URL}pdf/tuiuti/contratos` },
            { id: 'TA', url: `${CONFIG.API_URL}pdf/tuiuti/arquivos` },
            { id: 'TAx', url: `${CONFIG.API_URL}pdf/tuiuti/anexos` },
            { id: 'T2024Eb', url: `${CONFIG.API_URL}pdf/tuiuti/2024/extratosbancarios` },
            { id: 'T2024Cb', url: `${CONFIG.API_URL}pdf/tuiuti/2024/conciliacaobancaria` },
            { id: 'T2023PSE', url: `${CONFIG.API_URL}pdf/tuiuti/2023/pisosalarialenfermagem` },
            { id: 'T2023Eb', url: `${CONFIG.API_URL}pdf/tuiuti/2023/extratosbancarios` },
            { id: 'T2023Cb', url: `${CONFIG.API_URL}pdf/tuiuti/2023/conciliacaobancaria` },
            { id: 'T2022Ra', url: `${CONFIG.API_URL}pdf/tuiuti/2022/relatoriosanuais` },
            { id: 'T2022Eb', url: `${CONFIG.API_URL}pdf/tuiuti/2022/extratosbancarios` },
            { id: 'T2022Cb', url: `${CONFIG.API_URL}pdf/tuiuti/2022/conciliacaobancaria` },
            { id: 'T2021Ra', url: `${CONFIG.API_URL}pdf/tuiuti/2021/relatoriosanuais` },
            { id: 'T2021Eb', url: `${CONFIG.API_URL}pdf/tuiuti/2021/extratosbancarios` },
            { id: 'T2021Cb', url: `${CONFIG.API_URL}pdf/tuiuti/2021/conciliacaobancaria` },
            { id: 'T2021Bl', url: `${CONFIG.API_URL}pdf/tuiuti/2021/balanco` },
            { id: 'T2020Ra', url: `${CONFIG.API_URL}pdf/tuiuti/2020/relatoriosanuais` },
            { id: 'T2020Eb', url: `${CONFIG.API_URL}pdf/tuiuti/2020/extratosbancarios` },
            { id: 'T2020Cb', url: `${CONFIG.API_URL}pdf/tuiuti/2020/conciliacaobancaria` },
            { id: 'T2020Bl', url: `${CONFIG.API_URL}pdf/tuiuti/2020/balanco` },
            { id: 'T2019Ra', url: `${CONFIG.API_URL}pdf/tuiuti/2019/relatoriosanuais` },
            { id: 'T2019Eb', url: `${CONFIG.API_URL}pdf/tuiuti/2019/extratosbancarios` },
            { id: 'T2019Cb', url: `${CONFIG.API_URL}pdf/tuiuti/2019/conciliacaobancaria` },
            { id: 'T2019Bl', url: `${CONFIG.API_URL}pdf/tuiuti/2019/balanco` },
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
            <h1>Tuiuti - SP</h1>
            <h3>Contratos</h3>
            <ul>
                {pdfData.TC && pdfData.TC.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/contratos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>Arquivos</h3>
            <ul>
                {pdfData.TA && pdfData.TA.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/arquivos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>Anexos</h3>
            <ul>
                {pdfData.TAx && pdfData.TAx.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/anexos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2024</h3>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.T2024Eb && pdfData.T2024Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2024/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.T2024Cb && pdfData.T2024Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2024/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2023</h3>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.T2023Eb && pdfData.T2023Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2023/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.T2023Cb && pdfData.T2023Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2023/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Piso Salarial Enfermagem</h4>
            <ul>
                {pdfData.T2023PSE && pdfData.T2023PSE.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2023/pisosalarialenfermagem/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2022</h3>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.T2022Eb && pdfData.T2022Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2022/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.T2022Cb && pdfData.T2022Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2022/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.T2022Ra && pdfData.T2022Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2022/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2021</h3>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.T2021Eb && pdfData.T2021Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2021/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.T2021Cb && pdfData.T2021Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2021/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.T2021Ra && pdfData.T2021Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2021/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.T2021Bl && pdfData.T2021Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2021/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2020</h3>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.T2020Eb && pdfData.T2020Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.T2020Cb && pdfData.T2020Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2020/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.T2020Ra && pdfData.T2020Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2020/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.T2020Bl && pdfData.T2020Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2019</h3>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.T2019Eb && pdfData.T2019Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2019/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.T2019Cb && pdfData.T2019Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2019/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.T2019Ra && pdfData.T2019Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2019/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.T2019Bl && pdfData.T2019Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}tuiuti/2019/balanco/${pdf}`} 
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

export default Tuiuti;
