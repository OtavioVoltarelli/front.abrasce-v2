import './style.css';
import './media-query.css';
import Form from '../../components/Form-Contact';
import location from './assets/location-icon.png'
import mail from './assets/mail-icon.png'
import phone from './assets/phone-icon.png'

function Contact() {
    return (
        <main>
            <section id='contact'>
                <div id="form">
                    <article>
                        <Form />
                    </article>
                </div>
                <div id='infos'>
                    <article>
                        <img src={mail} alt="Mail icon" />
                        <h4>EMAIL</h4>
                        <a href="mailto:contato@empresa.com">contato@abrascesocial.org.br</a>
                    </article>
                    <article>
                        <img src={phone} alt="Phone icon" />
                        <h4>TELEFONE</h4>
                        <a href="tel:+5511999998888">(11)3288-1566</a>
                    </article>
                    <article>
                        <img src={location} alt="Location icon" />
                        <h4>ENDEREÇO 1</h4>
                        <address>
                            <p>Rua Paulo de Faria - 146 - Vila Gustavo</p>
                            <p>Andar 10 Conj 1006</p>
                            <p>CEP: 02.267-000 - São Paulo</p>
                        </address>
                    </article>
                    <article>
                        <img src={location} alt="Location icon" />
                        <h4>ENDEREÇO 2</h4>
                        <address>
                            <p>Praça 14 de Janeiro - 06 - Centro</p>
                            <p>Casa Branca - SP</p>
                            <p>CEP: 13700-000</p>
                        </address>
                    </article>
                </div>
            </section>
            <section id='maps'>
                <h4>ENDEREÇO 1</h4>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.5210136225123!2d-46.604561863207906!3d-23.482455553094404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef738b03d9841%3A0x9883a9990ed82dce!2sR.%20Paulo%20de%20Faria%2C%20146%20-%20Vila%20Gustavo%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002267-000!5e0!3m2!1spt-BR!2sbr!4v1730751518105!5m2!1spt-BR!2sbr" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Endereço 1 - Localização no Google Maps" >
                </iframe>
                <h4>ENDEREÇO 2</h4>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.0765644865437!2d-47.07853508828376!3d-21.777297579982775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b7dedd1786dadf%3A0x6b5689c1535f0a97!2sPra%C3%A7a%20Quatorze%20de%20Janeiro%2C%206%20-%20Jardim%20Eldorado%2C%20Casa%20Branca%20-%20SP%2C%2013700-000!5e0!3m2!1spt-BR!2sbr!4v1730751796359!5m2!1spt-BR!2sbr"
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Endereço 2 - Localização no Google Maps" >
                </iframe>
            </section>
        </main>
    )
}

export default Contact;