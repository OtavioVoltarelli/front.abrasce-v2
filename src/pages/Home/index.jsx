import './style.css';
import './media-query.css';
import { Link } from 'react-router-dom'
import Carousel from "../../components/Carousel";
import educacional from './assets/educacional.jpg'
import esporte from './assets/esporte.jpg'
import lazer from './assets/lazer.jpg'
import saude from './assets/saude.jpg'
import cultura from './assets/cultura.jpg'
import mission from './assets/mission-white.png'
import vision from './assets/vision-white.png'
import value from './assets/value-white.png'
import assistsocial from './assets/assistsocial.jpg'



function Home() {
    return (
        <div>
        <Carousel />

        <section className='quem-somos'>
            <h2>Quem somos?</h2>
            <p>A Associação Brasileira de Apoio a Saúde, a Cultura e a Educação - ABRASCE - foi fundada em 15 de janeiro de 2008, no município de São Paulo (Capital), sob a forma de entidade de interesse social e utilidade pública, sendo atualmente uma entidade da sociedade civil sem fins lucrativos, com sede na Rua Paulo De Faria, 146, Andar 10 Conjunto 1006, Vila Gustavo - CEP 04004-906 - São Paulo/SP, inscrita no CNPJ sob nº 09.428.862/0001-94.</p>
        </section>
        <section className='missao-visao-valores'>
            <div className='titulo'>
                <h2>Missão, Visão e Valores</h2>
            </div>

            <div className='caixas'>
                <article>
                    <img src={mission} alt="Imagem representando missão" />
                    <h3>Nossa missão:</h3>
                    <p>Promover o bem-estar e a inclusão social por meio de iniciativas que atendam às necessidades da comunidade, oferecendo suporte em saúde, educação e cultura.</p>
                </article>
                <article>
                    <img src={vision} alt="Imagem representando visão" />
                    <h3>Nossa visão:</h3>
                    <p>Ser uma referência em ações sociais transformadoras, inspirando outras organizações e mobilizando a sociedade para um mundo mais justo e igualitário.</p>
                </article>
                <article>
                    <img src={value} alt="Imagem representando valor" />
                    <h3>Nossos valores:</h3>
                    <p><strong>Compromisso: </strong>Dedicamo-nos a trabalhar incansavelmente pelo bem-estar da comunidade.</p>
                    <p><strong>Respeito: </strong>Valorizamos a dignidade e os direitos de todas as pessoas.</p>
                    <p><strong>Soliedariedade: </strong>Acreditamos na importância de apoiar uns aos outros em tempos de necessidade.</p>
                    <p><strong>Transparência: </strong>Atuamos com clareza e honestidade em todas as nossas ações e comunicações.</p>
                    <p><strong>Inovação: </strong>Buscamos constantemente novas formas de impactar positivamente a vida das pessoas.</p>
                </article>
            </div>
        </section>

        <section className='atuacao'>
            <div className='titulo'>
                <h2>Campos em que atuamos</h2>
            </div>
            <article>
                <Link to="/projetos/educacional">
                    <img src={educacional} alt="Imagem representando educação" />
                </Link>
                <div className='texto'>
                    <h3>Educação:</h3>
                    <p>Promovemos o acesso ao conhecimento com programas que capacitam jovens e adultos.
                    Nossa missão é abrir portas para o crescimento pessoal e profissional através da educação.</p>
                </div>
            </article>
            <article>
                <Link to="/projetos/esporte">
                    <img src={esporte} alt="Imagem representando esporte" />
                </Link>
                <div className='texto'>
                    <h3>Esporte:</h3>
                    <p>O esporte é um agente de inclusão e transformação. Promovemos atividades que incentivam o trabalho em equipe, a saúde e a disciplina, fortalecendo a convivência e os vínculos sociais</p>
                </div>
            </article>
            <article>
                <Link to="/projetos/lazer">
                    <img src={lazer} alt="Imagem representando lazer" />
                </Link>
                <div className='texto'>
                    <h3>Lazer:</h3>
                    <p>Oferecemos momentos de lazer para melhorar o bem-estar da comunidade. Com eventos culturais e atividades recreativas, promovemos integração e saúde mental.</p>
                </div>
            </article>
            <article>
                <Link to="/projetos/saude">
                    <img src={saude} alt="Imagem representando saúde" />
                </Link>
                <div className='texto'>
                    <h3>Saúde:</h3>
                    <p>Apoiamos a saúde comunitária com ações de prevenção e conscientização. 
                    Nosso objetivo é que todos tenham acesso a informações e cuidados essenciais para uma vida saudável.</p>
                </div>
            </article>
            <article>
                <Link to="/projetos/cultura">
                    <img src={cultura} alt="Imagem representando cultura" />
                </Link>
                <div className='texto'>
                    <h3>Cultura:</h3>
                    <p>Promovemos a cultura local por meio de eventos e oficinas que celebram a diversidade, incentivando o acesso à arte e ao patrimônio cultural da comunidade.</p>
                </div>
            </article>
            <article>
                <Link to="/projetos/assistencia-social">
                    <img src={assistsocial} alt="Imagem representando saúde" />
                </Link>
                <div className='texto'>
                    <h3>Assistência Social:</h3>
                    <p>Oferecemos apoio para pessoas em vulnerabilidade, promovendo ações de inclusão e desenvolvimento para fortalecer a autonomia e a qualidade de vida da comunidade.</p>
                </div>
            </article>
        </section>
        </div>
    )
}

export default Home;