import CONFIG from '../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function SaoVicente() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'SvRh', url: `${CONFIG.API_URL}pdf/saovicente/recursoshumanos` },
            { id: 'SvPcf', url: `${CONFIG.API_URL}pdf/saovicente/prestacaodecontasfinal` },
            { id: 'SvCG', url: `${CONFIG.API_URL}pdf/saovicente/contratodegestacao` },
            { id: 'SvArn', url: `${CONFIG.API_URL}pdf/saovicente/atarelacaonominal` },
            { id: 'SvARp6', url: `${CONFIG.API_URL}pdf/saovicente/anexorp6` },
            { id: 'Sv2021R', url: `${CONFIG.API_URL}pdf/saovicente/2021/relatorios` },
            { id: 'Sv2021Cb', url: `${CONFIG.API_URL}pdf/saovicente/2021/conciliacaobancaria` },
            { id: 'Sv2021Bl', url: `${CONFIG.API_URL}pdf/saovicente/2021/balanco` },
            { id: 'Sv2020Eb', url: `${CONFIG.API_URL}pdf/saovicente/2020/extratosbancarios` },
            { id: 'Sv2020Cb', url: `${CONFIG.API_URL}pdf/saovicente/2020/conciliacaobancaria` },
            { id: 'Sv2020R', url: `${CONFIG.API_URL}pdf/saovicente/2020/relatorios` },
            { id: 'Sv2020Bl', url: `${CONFIG.API_URL}pdf/saovicente/2020/balanco` },
            { id: 'Sv2019Eb', url: `${CONFIG.API_URL}pdf/saovicente/2019/extratosbancarios` },
            { id: 'Sv2019Cb', url: `${CONFIG.API_URL}pdf/saovicente/2019/conciliacaobancaria` },
            { id: 'Sv2019R', url: `${CONFIG.API_URL}pdf/saovicente/2019/relatorios` },
            { id: 'Sv2019Bl', url: `${CONFIG.API_URL}pdf/saovicente/2019/balanco` },
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
            <h1>São Vicente - SP</h1>
            <h3>Recursos Humanos</h3>
            <ul>
                {pdfData.SvRh && pdfData.SvRh.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/recursoshumanos/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Prestação de Contas Final</h3>
            <ul>
                {pdfData.SvPcf && pdfData.SvPcf.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/prestacaodecontasfinal/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Contrato de Gestação</h3>
            <ul>
                {pdfData.SvCG && pdfData.SvCG.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/contratodegestacao/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Ata de Relação Nominal</h3>
            <ul>
                {pdfData.SvArn && pdfData.SvArn.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/atarelacaonominal/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>Anexo RP 6</h3>
            <ul>
                {pdfData.SvARp6 && pdfData.SvARp6.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/anexorp6/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h3>2021</h3>
            <h4>- Relatórios</h4>
            <ul>
                {pdfData.Sv2021R && pdfData.Sv2021R.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2021/relatorios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Sv2021Cb && pdfData.Sv2021Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2021/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>- Balanço</h4>
            <ul>
                {pdfData.Sv2021Bl && pdfData.Sv2021Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2021/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2020</h3>
            <h4>- Relatórios</h4>
            <ul>
                {pdfData.Sv2020R && pdfData.Sv2020R.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2020/relatorios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.Sv2020Eb && pdfData.Sv2020Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2020/extratosbancarios${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Sv2020Cb && pdfData.Sv2020Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2020/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>- Balanço</h4>
            <ul>
                {pdfData.Sv2020Bl && pdfData.Sv2020Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2020/balanco/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>


            <h3>2019</h3>
            <h4>- Relatórios</h4>
            <ul>
                {pdfData.Sv2019R && pdfData.Sv2019R.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2019/relatorios/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>
            <h4>- Extratos Bancários</h4>
            <ul>
                {pdfData.Sv2019Eb && pdfData.Sv2019Eb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2019/extratosbancarios${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>- Conciliação Bancária</h4>
            <ul>
                {pdfData.Sv2019Cb && pdfData.Sv2019Cb.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2019/conciliacaobancaria/${pdf}`} 
                            target="_blank" 
                            rel="noopener noreferrer">
                            {pdf}
                        </a>
                    </li>
                ))}
            </ul>

            <h4>- Balanço</h4>
            <ul>
                {pdfData.Sv2019Bl && pdfData.Sv2019Bl.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}saovicente/2019/balanco/${pdf}`} 
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

export default SaoVicente;
