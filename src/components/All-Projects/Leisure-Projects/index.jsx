import ProjectComponent from '../../Project-Component';
import esportemoratense from '../assets/esporte-moratense.png';
import paie from '../assets/paie-logo.jpeg';

function LeisureProjects() {

    return (
        <main>
            <ProjectComponent projectName={"Esporte Moratense"} city={"Francisco Morato - SP"} logo={esportemoratense}></ProjectComponent>

            <ProjectComponent projectName={"Paiê"} city={"Casa Branca - SP"} logo={paie}></ProjectComponent>
        </main>
    )
}

export default LeisureProjects;