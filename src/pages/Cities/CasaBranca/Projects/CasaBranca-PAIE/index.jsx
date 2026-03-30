import './style.css';
import React, { useEffect, useState } from 'react';
import CONFIG from '../../../../../config';

function CasaBrancaPAIE() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'pTFA', url: `${CONFIG.API_URL}pdf/casabranca/paie/termodefomentoeadtivos` },

            { id: 'p2024Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2024/relatoriosanuais` },
            { id: 'p2024Eb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2024/extratosbancarios` },
            { id: 'p2024Cb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2024/conciliacaobancaria` },

            { id: 'p2023Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2023/relatoriosanuais` },
            { id: 'p2023Eb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2023/extratosbancarios` },
            { id: 'p2023Cb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2023/conciliacaobancaria` },

            { id: 'p2022Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2022/relatoriosanuais` },
            { id: 'p2022Eb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2022/extratosbancarios` },
            { id: 'p2022Cb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2022/conciliacaobancaria` },
            { id: 'p2022Bl', url: `${CONFIG.API_URL}pdf/casabranca/paie/2022/balanco` },

            { id: 'p2021Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2021/relatoriosanuais` },
            { id: 'p2021Eb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2021/extratosbancarios` },
            { id: 'p2021Cb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2021/conciliacaobancaria` },
            { id: 'p2021Bl', url: `${CONFIG.API_URL}pdf/casabranca/paie/2021/balanco` },

            { id: 'p2020Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2020/relatoriosanuais` },
            { id: 'p2020Eb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2020/extratosbancarios` },
            { id: 'p2020Cb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2020/conciliacaobancaria` },
            { id: 'p2020Bl', url: `${CONFIG.API_URL}pdf/casabranca/paie/2020/balanco` },

            { id: 'p2019Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2019/relatoriosanuais` },
            { id: 'p2019Od', url: `${CONFIG.API_URL}pdf/casabranca/paie/2019/outrosdocumentos` },
            { id: 'p2019Cb', url: `${CONFIG.API_URL}pdf/casabranca/paie/2019/conciliacaobancaria` },
            { id: 'p2019Bl', url: `${CONFIG.API_URL}pdf/casabranca/paie/2019/balanco` },

            { id: 'p2018Ra', url: `${CONFIG.API_URL}pdf/casabranca/paie/2018/relatoriosanuais` },
            { id: 'p2018Od', url: `${CONFIG.API_URL}pdf/casabranca/paie/2018/outrosdocumentos` },
            { id: 'p2018Bl', url: `${CONFIG.API_URL}pdf/casabranca/paie/2018/balanco` },
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
            <h2>PAIE</h2>

            <h3>Termo de Fomento e Adtivos</h3>
            <ul>
                {pdfData.pTFA && pdfData.pTFA.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/termodefomentoeadtivos/${pdf}`} 
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
                {pdfData.p2024Eb && pdfData.p2024Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2024/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.p2024Cb && pdfData.p2024Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2024/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2024Ra && pdfData.p2024Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2024/relatoriosanuais/${pdf}`} 
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
                {pdfData.p2023Eb && pdfData.p2023Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2023/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.p2023Cb && pdfData.p2023Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2023/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2023Ra && pdfData.p2023Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2023/relatoriosanuais/${pdf}`} 
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
                {pdfData.p2022Eb && pdfData.p2022Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2022/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.p2021Cb && pdfData.p2021Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2021/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.p2021Bl && pdfData.p2021Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2021/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2022Ra && pdfData.p2022Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2022/relatoriosanuais/${pdf}`} 
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
                {pdfData.p2021Eb && pdfData.p2021Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2021/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.p2021Cb && pdfData.p2021Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2021/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.p2021Bl && pdfData.p2021Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2021/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2021Ra && pdfData.p2021Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2021/relatoriosanuais/${pdf}`} 
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
                {pdfData.p2020Eb && pdfData.p2020Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2020/extratosbancarios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.p2020Cb && pdfData.p2020Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2020/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.p2020Bl && pdfData.p2020Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2020Ra && pdfData.p2020Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2020/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2019</h3>
            <h4>- Outros Documentos</h4>
            <ul>
                {pdfData.p2019Od && pdfData.p2019Od.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2019/outrosdocumentos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.p2019Cb && pdfData.p2019Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2019/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.p2019Bl && pdfData.p2019Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2019/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2019Ra && pdfData.p2019Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2019/relatoriosanuais/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h3>2018</h3>
            <h4>- Outros Documentos</h4>
            <ul>
                {pdfData.p2018Od && pdfData.p2018Od.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2018/outrosdocumentos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Balanço</h4>
            <ul>
                {pdfData.p2018Bl && pdfData.p2018Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2018/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Relatórios Anuais</h4>
            <ul>
                {pdfData.p2018Ra && pdfData.p2018Ra.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}casabranca/paie/2018/relatoriosanuais/${pdf}`} 
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

export default CasaBrancaPAIE;
