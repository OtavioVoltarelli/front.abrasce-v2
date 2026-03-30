import React from 'react';
import CONFIG from '../../config';

function Jobs({ title, pdf }) {
    return (
        <div>
            {pdf ? (
                <a href={`${CONFIG.API_URL}files/${pdf}`} target="_blank" rel="noopener noreferrer">
                    <h3>{title}</h3>
                </a>
            ) : (
                <p>Carregando PDF...</p>
            )}
        </div>
    );
}

export default Jobs;