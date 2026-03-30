import ProjectComponent from '../../Project-Component';
import escoladearte from '../assets/escola-de-arte.jpeg';
import paie from '../assets/paie-logo.jpeg';

function CulturalProjects() {

    return (
        <main>
            <ProjectComponent projectName={"Escola de Artes"} city={"Jaboticabal - SP"} logo={escoladearte}></ProjectComponent>

            <ProjectComponent projectName={"Paiê"} city={"Casa Branca - SP"} logo={paie}></ProjectComponent>
        </main>
    )
}

export default CulturalProjects;