import  { useState } from 'react';
import './HamburgerMenu.css';

export const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='hamburger-menu'>
            <div className={`hamburger ${isOpen ? 'is-open' : ''}`} onClick={toggleMenu}>
                <div className="line up"></div>
                <div className="line down"></div>
            </div>
            <div className={`menu ${isOpen ? 'is-open' : ''}`}>
                <a href='/'>Home</a>
                <a href='/news'>News</a>
                <a href='/bands'>Bands</a>
                <a href='/concerts'>Concerts</a>
            </div>

        </div>
    );
};