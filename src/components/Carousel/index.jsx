// Carousel.js
import React, { useState, useEffect } from 'react';
import './style.css';
import './media-query.css';
import imagem1 from './assets/1.jpg';
import imagem2 from './assets/2.jpg';
import imagem3 from './assets/3.jpg';

const Carousel = () => {
    const [index, setIndex] = useState(0);
    const images = [imagem1, imagem2, imagem3];

    const nextSlide = () => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
    <div className="carousel">
        <div className="slides" style={{ transform: `translateX(-${index * 100}%)` }}>
            {images.map((image, i) => (
                <img key={i} src={image} alt={`Imagem ${i + 1}`} className="slide" />
            ))}
        </div>
        <button className="carousel-button prev" onClick={prevSlide}>
        &#9664;
        </button>
        <button className="carousel-button next" onClick={nextSlide}>
        &#9654;
        </button>
    </div>
    );
};

export default Carousel;
