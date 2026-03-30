import CONFIG from '../../../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function CasaBrancaRi() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'riTc', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/termodecolaboracao` },
            { id: 'ri2024FmpfEb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2024/fontemunicipal-portoferreira/extratosbancarios` },
            { id: 'ri2024FmpfCb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2024/fontemunicipal-portoferreira/conciliacaobancaria` },
            { id: 'ri2024FmEb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2024/fontemunicipal/extratosbancarios` },
            { id: 'ri2024FmCb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2024/fontemunicipal/conciliacaobancaria` },
            { id: 'ri2024FeEb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2024/fonteestadual/extratosbancarios` },
            { id: 'ri2024FeCb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2024/fonteestadual/conciliacaobancaria` },
            { id: 'ri2023Eb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2023/extratosbancarios` },
            { id: 'ri2023Cb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2023/conciliacaobancaria` },
            { id: 'ri2022Eb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2022/extratosbancarios` },
            { id: 'ri2022Cb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2022/conciliacaobancaria` },
            { id: 'ri2022Bl', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2022/balanco` },
            { id: 'ri2021Eb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2021/extratosbancarios` },
            { id: 'ri2021Cb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2021/conciliacaobancaria` },
            { id: 'ri2021Bl', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2021/balanco` },
            { id: 'ri2020Eb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2020/extratosbancarios` },
            { id: 'ri2020Cb', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2020/conciliacaobancaria` },
            { id: 'ri2020Bl', url: `${CONFIG.API_URL}pdf/casabranca/residenciainclusiva/2020/balanco` },
            
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
            <h2>Residência Inclusiva</h2>

            <h3>Termo de Colaboração</h3>
            <ul>
                {pdfData.riTc && pdfData.riTc.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/termodecolaboracao/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2024</h3>
            <h4>Fonte Municipal - Porto Ferreira</h4>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2024FmpfEb && pdfData.ri2024FmpfEb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fontemunicipal-portoferreira/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2024FmpfCb && pdfData.ri2024FmpfCb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fontemunicipal-portoferreira/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>Fonte Municipal</h4>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2024FmEb && pdfData.ri2024FmEb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fontemunicipal/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2024FmCb && pdfData.ri2024FmCb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fontemunicipal/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>Fonte Estadual</h4>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2024FeEb && pdfData.ri2024FeEb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fonteestadual/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2024FeCb && pdfData.ri2024FeCb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fonteestadual/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2024FeEb && pdfData.ri2024FeEb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fonteestadual/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2024FeCb && pdfData.ri2024FeCb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2024/fonteestadual/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2023</h3>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2023Eb && pdfData.ri2023Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2023/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2023Cb && pdfData.ri2023Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2023/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2022</h3>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2022Eb && pdfData.ri2022Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2022/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2022Cb && pdfData.ri2022Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2022/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Balanço</p>
            <ul>
                {pdfData.ri2022Bl && pdfData.ri2022Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2022/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2021</h3>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2021Eb && pdfData.ri2021Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2021/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2021Cb && pdfData.ri2021Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2021/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Balanço</p>
            <ul>
                {pdfData.ri2021Bl && pdfData.ri2021Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2021/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2020</h3>
            <p>- Extratos Bancários</p>
            <ul>
                {pdfData.ri2020Eb && pdfData.ri2020Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Conciliação Bancária</p>
            <ul>
                {pdfData.ri2020Cb && pdfData.ri2020Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2020/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <p>- Balanço</p>
            <ul>
                {pdfData.ri2020Bl && pdfData.ri2020Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/residenciainclusiva/2020/balanco/${pdf}`} 
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

export default CasaBrancaRi;
