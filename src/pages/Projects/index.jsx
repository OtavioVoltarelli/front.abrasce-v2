import './style.css';
import './media-query.css';
import {Link} from 'react-router-dom';
import educacional from '../Home/assets/educacional.jpg'
import esporte from '../Home/assets/esporte.jpg'
import lazer from '../Home/assets/lazer.jpg'
import saude from '../Home/assets/saude.jpg'
import cultura from '../Home/assets/cultura.jpg'
import assistsocial from '../Home/assets/assistsocial.jpg'


function Projects() {
    return (
        <div>
            <section className="titulo">
                <h2>Mudando o presente, transformando o futuro.</h2>
            </section>
            <section className="projetos">
                <article>
                    <div className='texto'>
                        <Link to="/projetos/educacao">
                            <h3>PROJETOS EDUCACIONAIS</h3>
                        </Link>
                        <p>Visamos promover o aprendizado e o desenvolvimento pessoal por meio de iniciativas voltadas à educação formal e informal. Nossa organização desenvolve programas que abrangem desde reforço escolar até cursos de qualificação profissional, buscando oferecer oportunidades para que crianças, jovens e adultos ampliem seu conhecimento e construam um futuro mais promissor. Acreditamos que a educação é a base para o crescimento social e individual, e nosso objetivo é tornar o aprendizado acessível e transformador para todas as idades.</p>
                    </div>
                    <Link to="/projetos/educacao">
                        <img src={educacional} alt="Imagem representando educação"/>
                    </Link>
                </article>
                <article>
                    <div className='texto'>
                        <Link to="/projetos/esporte">
                            <h3>PROJETOS ESPORTIVOS </h3>
                        </Link>
                        <p>Nossos projetos esportivos incentivam a prática de atividades físicas como um caminho para a saúde, disciplina e desenvolvimento pessoal. Com atividades que vão desde escolinhas de esporte até competições e eventos esportivos, buscamos envolver crianças, jovens e adultos em uma rotina saudável, onde o esporte é uma ferramenta de inclusão e transformação. Esses projetos são criados para inspirar o espírito de equipe, a superação de limites e o respeito ao próximo, valores essenciais que o esporte ensina e que contribuem para a formação de cidadãos comprometidos com o bem-estar coletivo.</p>
                    </div>
                    <Link to="/projetos/esporte">
                        <img src={esporte} alt="Imagem representando esporte"/>
                    </Link>
                </article>
                <article>
                    <div className='texto'>
                        <Link to="/projetos/lazer">
                            <h3>PROJETOS DE LAZER</h3>
                        </Link>
                        <p>Os projetos de lazer são voltados ao bem-estar e à qualidade de vida, oferecendo atividades recreativas e culturais que promovem momentos de relaxamento, integração social e entretenimento para todos os públicos. Com ações que incluem eventos, oficinas de arte, cinema e atividades lúdicas, buscamos proporcionar espaços de convivência e diversão, onde a comunidade possa desfrutar de experiências enriquecedoras. Esses projetos incentivam a criatividade, a expressão cultural e o fortalecimento dos laços sociais, essenciais para uma vida saudável e equilibrada.</p>
                    </div>
                    <Link to="/projetos/lazer">
                        <img src={lazer} alt="Imagem representando lazer"/>
                    </Link>
                </article>
                <article>
                    <div className='texto'>
                        <Link >
                            <h3>PROJETOS DE SAÚDE</h3>
                        </Link>
                        <p>Temos como objetivo promover o bem-estar físico e mental da comunidade, oferecendo ações preventivas e de conscientização sobre temas fundamentais para uma vida saudável. Por meio de campanhas de saúde, atendimento básico e palestras educativas, buscamos capacitar os participantes para adotarem hábitos mais saudáveis e cuidar melhor de si mesmos e de suas famílias. Estes projetos são desenvolvidos com a missão de construir uma sociedade mais informada, ativa e comprometida com a prevenção de doenças e a promoção da saúde.</p>
                    </div>
                    <Link to="/projetos/saude">
                        <img src={saude} alt="Imagem representando saúde"/>
                    </Link>
                </article>
                <article>
                    <div className='texto'>
                        <Link to="/projetos/cultura">
                            <h3>PROJETOS CULTURAIS</h3>
                        </Link>
                        <p>O Projeto Cultural visa enriquecer a comunidade com acesso e incentivo a atividades culturais, promovendo eventos e oficinas que celebram a diversidade e o patrimônio cultural local. Esses projetos estimulam a criatividade e a expressão artística, além de contribuir para a formação de um senso de identidade e pertencimento. Com o propósito de fortalecer o envolvimento da comunidade, o projeto valoriza as tradições e inovações culturais, proporcionando experiências transformadoras que ampliam o horizonte cultural de todos os envolvidos.</p>
                    </div>
                    <Link to="/projetos/cultura">
                        <img src={cultura} alt="Imagem representando cultura"/>
                    </Link>
                </article>
                <article>
                    <div className='texto'>
                        <Link to="/projetos/assistencia-social">
                            <h3>PROJETOS DE ASSISTÊNCIA SOCIAL</h3>
                        </Link>
                        <p>O Projeto de Assistência Social tem como objetivo apoiar as pessoas em situação de vulnerabilidade, promovendo ações que contribuam para a melhoria da qualidade de vida e o acesso a direitos básicos. Através de programas de orientação, capacitação e suporte material, esse projeto busca fortalecer as redes de apoio e inclusão social, proporcionando uma assistência integral que vai além do auxílio imediato, visando o desenvolvimento de habilidades e a autonomia dos beneficiados.</p>
                    </div>
                    <Link to="/projetos/assistencia-social">
                        <img src={assistsocial} alt="Imagem representando assistencia social"/>
                    </Link>
                </article>
            </section>
            
        </div>
    )
}

export default Projects;