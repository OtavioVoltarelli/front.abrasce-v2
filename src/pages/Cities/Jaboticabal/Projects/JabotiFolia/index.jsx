import CONFIG from '../../../../../config';
import './style.css';
import React, { useEffect, useState } from 'react';

function JabotiFolia() {
    const [pdfData, setPdfData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const endpoints = [ //os ids sao as iniciais das pastas
            { id: 'Jf', url: `${CONFIG.API_URL}pdf/jaboticabal/jabotifolia` },
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
            <h2>JabotiFolia</h2>
            <ul>
                {pdfData.Jf && pdfData.Jf.map((pdf, index) => (
                    <li key={index}>
                        <a 
                            href={`${CONFIG.FILES_URL}jaboticabal/jabotifolia/${pdf}`} 
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

export default JabotiFolia;
