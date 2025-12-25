import { useState, useEffect } from 'react';
import { FaExpand, FaSignOutAlt,  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './sidebar.css'
import backIcon from '../../../../assets/icons/react.svg'


export const Sidebar = ({ goBack }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.imageUrl) {
        setImageUrl(parsed.imageUrl);
      }
    }
  }, []);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err =>
        console.error(`Error al entrar en pantalla completa: ${err.message}`)
      );
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleLogout = () => {
    setShowLogout(prev => !prev);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div>
          <button onClick={toggleFullscreen} className="fullscreen-btn" title="Pantalla completa">
            <FaExpand />
          </button>


          <img src={backIcon} alt="" className='back-icon' onClick={goBack} title="Ir atrás" />
 
        </div>

        <div className="sidebar-user">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Perfil"
              className="profile-pic"
              onClick={toggleLogout}
              title="Ver opciones"
            />
          ) : (
            <div className="profile-placeholder" onClick={toggleLogout}>User</div>
          )}

          {showLogout && (
            <div className="sidebar-footer">
              <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};