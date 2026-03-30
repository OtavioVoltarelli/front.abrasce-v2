import { useEffect, useState } from "react";
import "./style.css";
import * as XLSX from "xlsx";
import CONFIG from "../../config";

function Candidates() {
    const [processes, setProcesses] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [filter, setFilter] = useState("actives");

    useEffect(() => {
        const url = filter === "actives"
            ? `${CONFIG.API_URL}recruitment-process/actives`
            : `${CONFIG.API_URL}recruitment-process`;

        fetch(url)
            .then(response => response.json())
            .then(data => setProcesses(Array.isArray(data) ? data : []));
    }, [filter]);

    const handleProcessChange = (event) => {
        const processId = event.target.value;
        setSelectedProcess(processId);

        if (processId) {
            fetch(`${CONFIG.API_URL}candidates/process/${processId}`)
                .then(response => response.json())
                .then(data => setCandidates(data));
        } else {
            setCandidates([]);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };


    // funcao para exportar os dados para excel
    const exportToExcel = () => {
        // remove a coluna 'cvUrl' dos dados antes de exportar
        const filteredCandidates = candidates.map(({ cvUrl, ...candidate }) => candidate);

        const ws = XLSX.utils.json_to_sheet(filteredCandidates); // converte os dados para o formato de planilha
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Candidatos");

        // cria e baixa o arquivo Excel
        XLSX.writeFile(wb, "candidatos.xlsx");
    };

    return (
        <main id="candidates">
            <article id="title">
                <h1>Candidatos</h1>
                <p>Selecione o processo seletivo para visualizar os candidatos</p>
            </article>

            <article id="filters">
                <div>
                    <label>
                        <select onChange={handleFilterChange} value={filter}>
                            <option value="actives">Somente processos ativos</option>
                            <option value="">Todos os processos</option>
                        </select>
                    </label>
                </div>

                <select onChange={handleProcessChange} value={selectedProcess}>
                    <option value="">Selecione um processo seletivo</option>
                    {processes.map(process => (
                        <option key={process.id} value={process.id}>{process.title}</option>
                    ))}
                </select>
            </article>    

            {candidates.length > 0 && (
                <>
                    <button id="excel" onClick={exportToExcel}>Exportar para Excel</button>
                    <article id="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Telefone</th>
                                    <th>Razão Social</th>
                                    <th>CNPJ</th>
                                    <th>Cidade</th>
                                    <th>Estado</th>
                                    <th>Data de Candidatura</th>
                                    <th>Currículo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map(candidate => (
                                    <tr key={candidate.id}>
                                        <td>{candidate.name}</td>
                                        <td>{candidate.email}</td>
                                        <td>{candidate.number}</td>
                                        <td>{candidate.companyName}</td>
                                        <td>{candidate.cnpj}</td>
                                        <td>{candidate.city}</td>
                                        <td>{candidate.state}</td>
                                        <td>{candidate.candidationDate}</td>
                                        <td>
                                            <a href={`${CONFIG.API_URL}files/${candidate.cvUrl}`} target="_blank" rel="noopener noreferrer">
                                                Abrir PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>
                </>
            )}
        </main>
    );
}

export default Candidates;
