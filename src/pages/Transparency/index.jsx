import './style.css';
import './media-query.css';
import { Link } from 'react-router-dom';


function Transparency() {
    return (
        <main id='transparency'>
            <section id="resume">
                <h1>TRANSPARÊNCIA</h1>
                <p>A ABRASCE (Associação Brasileira de Apoio a Saúde, a Cultura e a Educação) entende a importância da prestação de contas no terceiro setor e valoriza a transparência e a responsabilidade financeira como pilares fundamentais para manter a confiança de seus doadores e colaboradores. <br /> <br />
                Para isso, a ABRASCE tem como compromisso prestar contas de forma clara e transparente sobre as atividades desenvolvidas e os recursos financeiros gerenciados pela associação, garantindo que as informações sejam acessíveis e compreensíveis a todos os interessados. <br /> <br />
                A prestação de contas da ABRASCE inclui a apresentação regular de demonstrações financeiras auditadas, relatórios de atividades, lista de parceiros, certidões negativas de débitos e outras informações relevantes para avaliação do desempenho da organização.</p>
            </section>
            <section className='cities'>
                <Link to={'/transparencia/casa-branca'}>
                    <h3 className='city'>Casa Branca SP</h3>
                </Link>
                <Link to={"/transparencia/francisco-morato"}>
                    <h3 className='city'>Francisco Morato SP</h3>
                </Link>
                <Link to={"/transparencia/guaruja"}>
                    <h3 className='city'>Guarujá SP</h3>
                </Link>
                <Link to={"/transparencia/jaboticabal"}>
                    <h3 className='city'>Jaboticabal SP</h3>
                </Link>
                <Link to={"/transparencia/sao-vicente"}>
                    <h3 className='city'>São Vicente SP</h3>
                </Link>
                <Link to={"/transparencia/tuiuti"}>
                    <h3 className='city'>Tuiuti SP</h3>
                </Link>
                <Link to={"/transparencia/sede-abrasce"}>
                    <h3 className='city'>Sede Abrasce</h3>
                </Link>
            </section>
        </main>
    )
}

export default Transparency;