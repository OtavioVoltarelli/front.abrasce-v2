import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './style.css';
import './media-query.css';

function Navbar() {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(prevState => !prevState);
    };

    const checkWindowSize = () => {
        const menu = document.getElementById('options');
        if (window.innerWidth >= 768) {
            menu.style.display = 'block'; 
            setMenuVisible(true); 
        } else {
            menu.style.display = 'none'; 
            setMenuVisible(false); 
        }
    };

    useEffect(() => {
        checkWindowSize(); 

        window.addEventListener('resize', checkWindowSize);

        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    return (
        <nav>
            <Link to="/"> 
                <img className='logo' src={logo} alt="Logo da Abrasce Social" loading="lazy" /> 
            </Link>
            <i id='burguer' className="material-symbols-outlined" onClick={toggleMenu}>menu</i>
            <menu id='options' style={{ display: menuVisible ? 'block' : 'none' }}>
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>HOME</NavLink>
                    </li>
                    <li>
                        <NavLink to="/noticias" className={({ isActive }) => (isActive ? 'active' : '')}>NOTÍCIAS</NavLink>
                    </li>
                    <li>
                        <NavLink to="/projetos" className={({ isActive }) => (isActive ? 'active' : '')}>PROJETOS</NavLink>
                    </li>
                    <li>
                        <NavLink to="/contato" className={({ isActive }) => (isActive ? 'active' : '')}>CONTATO</NavLink>
                    </li>
                    <li>
                        <NavLink to="/transparencia" className={({ isActive }) => (isActive ? 'active' : '')}>TRANSPARÊNCIA</NavLink>
                    </li>
                    <li>
                        <NavLink to="/trabalhe-conosco" className={({ isActive }) => (isActive ? 'active' : '')}>TRABALHE CONOSCO</NavLink>
                    </li>
                </ul>
            </menu>
        </nav>
    );
}

export default Navbar;
