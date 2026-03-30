import ProjectComponent from '../../Project-Component';
import apoioescolar from '../assets/apoio-escolar.jpeg';
import paie from '../assets/paie-logo.jpeg';
import escoladearte from '../assets/escola-de-arte.jpeg';

function EducationalProjects() {

    return (
        <main>
            <ProjectComponent projectName={"Apoio Escolar"} city={"Jaboticabal - SP"} logo={apoioescolar}></ProjectComponent>

            <ProjectComponent projectName={"Paiê"} city={"Casa Branca - SP"} logo={paie}></ProjectComponent>

            <ProjectComponent projectName={"Escola de Artes"} city={"Jaboticabal - SP"} logo={escoladearte}></ProjectComponent>
        </main>
    )
}

export default EducationalProjects;