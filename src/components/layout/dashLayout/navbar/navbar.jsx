import { useState, useEffect, useRef } from 'react';
import { Logo } from '../../../ui/logo/logo';
import {
  FaHome,
  FaCogs,
  FaChartBar,
  FaDollarSign,

  FaFolderOpen
} from 'react-icons/fa';
import './navbar.css';

export const Navbar = ({ onSelect, selectedItem }) => {
  const [openSections, setOpenSections] = useState(() => {
    const saved = localStorage.getItem('openSections');
    return saved ? JSON.parse(saved) : [];
  });
  const menuRef = useRef(null);

  const toggleSection = (section) => {
    const updated = openSections.includes(section)
      ? openSections.filter((s) => s !== section)
      : [...openSections, section];
    setOpenSections(updated);
    localStorage.setItem('openSections', JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenSections([]);
        localStorage.removeItem('openSections');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getClass = (id) => (selectedItem === id ? 'active' : '');

  return (
    <div className="navbar" ref={menuRef}>
      <Logo/>
      <h4 className="menuh4">Menu</h4>
      <ul className="navbar-list">

        <li onClick={() => onSelect('control')} className={getClass('panel')}>
          <FaHome /> <span className="label">Panel de control</span>
        </li>

        <li  onClick={() => onSelect('content-artist')} className={getClass('content-artist')}>
            <FaFolderOpen /> <span className="label">Management of content</span>
        </li>



        <li onClick={() => onSelect('Analitycs')} className={getClass('analitycs')}>
            <FaChartBar /> <span className="label">Analytics</span>
          

        </li>

        <li onClick={() => onSelect('finance')} className={getClass('finance')}>
          <FaDollarSign /> <span className="label">Finance</span>
        </li>

        <li onClick={() => onSelect('settings')} className={getClass('settings')}>
          <FaCogs /> <span className="label">Settings</span>
        </li>

      </ul>
    </div>
  );
};