import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './style.css';

function RestrictedArea() {
    const navigate = useNavigate();

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return
        }
    }, [navigate, token]);

    return (
        <main id='restricted-area'>
            <Link to={"/area-restrita/processos-seletivos"} className='links'>
                <button>Processos seletivos</button>
            </Link>
            <Link to={'/area-restrita/candidatos'} className='links'>
                <button>Candidatos</button>
            </Link>
            <Link to={"/area-restrita/noticias"} className='links'>
                <button>Notícias</button>
            </Link>
            <Link to={'/area-restrita/contatos'} className='links'>
                <button>Contatos</button>
            </Link>
            <Link className='links'>
                <button>Usuários</button>
            </Link>
        </main>
    );
}

export default RestrictedArea;
