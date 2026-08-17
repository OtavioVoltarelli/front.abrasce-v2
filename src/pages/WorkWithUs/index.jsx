import { useEffect, useState } from 'react';
import './style.css';
import Form from './../../components/Form-WWU';
import JobsPreview from '../../components/Jobs-Preview';
import CONFIG from '../../config';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/Loading';
import { useActivesRecruitmentProcesses } from '../../hooks/useRecruitmentProcess';

function WorkWithUs() {

    const {data, isLoading, isError, error} = useActivesRecruitmentProcesses();

    if (isLoading) {
        return ( 
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '80vh' }}>
                <Loading />
            </div>
        );
    }

    if (isError) {
        return <div>Error: {error.message}</div>
    }

    return (
        <main>
            <h2>PROCESSOS SELETIVOS</h2>
            <section id='jobs'>
                <p>Clique no processo seletivo de sua preferência para acessar o edital.</p>
                {data.content.map((process) => (
                    <JobsPreview
                        key={process.id}
                        process={process}
                    />
                ))}
            </section>
        </main>
    );
}

export default WorkWithUs;
