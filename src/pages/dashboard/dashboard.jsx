import { useState, useEffect } from 'react';
// Importing layout components
import { Navbar } from '../../components/layout/dashLayout/navbar/navbar';
import { Sidebar } from '../../components/layout/dashLayout/sidebar/sidebar';
// Importing content components
import { Analitycs } from '../../components/layout/dashLayout/content/Analitycs/analitycs';
import { Control } from '../../components/layout/dashLayout/content/control/control';
import { ContentArtist } from '../../components/layout/dashLayout/content/contentArtist/contentArtist';
import { Finance } from '../../components/layout/dashLayout/content/finance/finance';
import { Settings } from '../../components/layout/dashLayout/content/settings/settings';
// Importing styles

import './dashboard.css';

export function Dashboard() {
      // 🔹 Estado inicial desde localStorage o valores por defecto
  const [selectedContent, setSelectedContent] = useState(() => {
    return localStorage.getItem('selectedContent') || 'panel';
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('contentHistory');
    return saved ? JSON.parse(saved) : ['panel'];
  });

  // 🔹 Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('selectedContent', selectedContent);
    localStorage.setItem('contentHistory', JSON.stringify(history));
  }, [selectedContent, history]);

  // Cambiar contenido y guardar historial
  const handleSelectContent = (content) => {
    setSelectedContent(content);
    setHistory((prev) => [...prev, content]);
  };

  // Ir atrás en el historial
  const goBack = () => {
    setHistory((prev) => {
      if (prev.length > 1) {
        const newHistory = [...prev];
        newHistory.pop(); // eliminar actual
        const last = newHistory[newHistory.length - 1];
        setSelectedContent(last);
        return newHistory;
      }
      return prev;
    });
  };

  // Renderizado condicional del contenido
    const renderContent = () => {
        switch (selectedContent) {
            case 'Analitycs':
                return <Analitycs />;
            case 'control':
                return <Control />;
            case 'content-artist':
                return <ContentArtist />;
            case 'finance':
                return <Finance />;
            case 'settings':
                return <Settings />;
            default:
                return <Control/>;
        }
    };
    return (
        <div className="dashboard-page">
        <div className="dashboard-navbar">
            <Navbar onSelect={handleSelectContent} selectedItem={selectedContent} />
        </div>
        <div className="dashboard-content">
            <div className="dashboard-menu">
            <Sidebar goBack={goBack} />
            </div>
            <div className="dashboard-outlet">
            {renderContent()}
            </div>
        </div>
        </div>
    )
}