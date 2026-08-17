import { useParams } from "react-router-dom";
import { useRecruitmentProcessById } from "../../hooks/useRecruitmentProcess";
import Loading from "../Loading";
import CandidationForm from "../Form-WWU";

function CompleteJobs({ }) {
    const { id } = useParams();
    const { data, isLoading, isError, error } = useRecruitmentProcessById(id);

    if (isLoading) {
        return <div><Loading /></div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    const process = data.content;

    return (
        <div>
            <h1>{process.title}</h1>
            <p>{process.description}</p>
            {process.filesPaths.map((file) => (
                <a key={file} href={`${import.meta.env.VITE_API_URL}/files/rps/${file}`} target="_blank" rel="noopener noreferrer">
                    <strong>Visualizar Edital</strong><br />
                </a>
            ))}
            <div>
                <h2>Candidatar-se</h2>
                <CandidationForm recruitmentProcessId={id} />
            </div>
        </div>
    );
}

export default CompleteJobs;