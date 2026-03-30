import { useEffect, useState } from 'react';
import './style.css';
import Form from './../../components/Form-WWU';
import Jobs from './../../components/Jobs';
import CONFIG from '../../config';

function WorkWithUs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${CONFIG.API_URL}recruitment-process/actives`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar os processos seletivos');
                }
                const data = await response.json();
                console.log(data)
                setJobs(data);
            } catch (error) {
                console.error('Erro ao buscar os processos seletivos:', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <main>
            <section id='jobs'>
                <h2>PROCESSOS SELETIVOS</h2>
                <p>Clique no processo seletivo de sua preferência para acessar o edital.</p>
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <Jobs key={job.id} title={job.title} pdf={job.pdfUrl} />
                    ))
                ) : (
                    <p>Carregando processos seletivos...</p>
                )}
            </section>
            <section id='form-infos'>
                <h2>FORMULÁRIO DE INSCRIÇÃO</h2>
                <p>Selecione o processo seletivo no qual deseja se inscrever e preencha o formulário abaixo com suas informações.</p>
                <article>
                    <Form />
                </article>
            </section>
        </main>
    );
}

export default WorkWithUs;
