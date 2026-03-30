import './style.css'

function ProjectComponent({logo, projectName, city}) {

    return (
        <main className='projects'>
                <img className='projects-img' src={logo} alt={`Logo do projeto ${projectName}`} />
                <h3 className='projects-title'>{projectName}</h3>
                <p className='projects-city'>{city}</p>
        </main>
    )
}

export default ProjectComponent;