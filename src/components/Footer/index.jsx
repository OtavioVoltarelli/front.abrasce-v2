import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import './style.css';
import './media-query.css';
import logo from '../../assets/logo.png'

function Footer() {
    return (
        <footer>
            <section className='mensagem'>
                <p>Gostou do que viu? Fale com a gente! Todas as informações estão disponíveis na aba <strong>contato</strong></p>
                <Button to="/contato" text='Ir para contato'/>
            </section>
            <section id='restricted-area'>
                <Link to="/area-restrita"><button>Área Restrita</button></Link>
            </section>
            <div className='footer-content'>
                <img className='logo' src={logo} alt="Logo Abrasce Social" loading='lazy' />
                <section className='contato'>
                    <h3>Entre em contato conosco:</h3>
                    <p><strong>E-mail: </strong><a href="malito:contato@abrascesocial.org.br">contato@abrascesocial.org.br</a></p>
                    <p><strong>Telefone: </strong><a href="tel:+551132881566">(11)3288-1566</a></p>
                </section>
                <section className='localizacao'>
                    <address>
                        <h3>Localização:</h3>
                        <p>Rua Paulo de Faria - 146 - Vila Gustavo</p>
                        <p>Andar 10 Conj 1006</p>
                        <p>CEP: 02.267-000 - São Paulo</p>
                    </address>
                </section>
            </div>

            <section className='copy'>
            <p>&copy; 2025 by <strong>ABRASCE Social</strong></p>
            </section>
        </footer>
    );
}

export default Footer;