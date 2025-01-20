
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home/home';
import { Bands } from './pages/bands/bands';
import { Concierts } from './pages/concierts/concierts';
import { News } from './pages/news/news';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import './App.css'

function App() {
     useEffect(() => {
         const handleScroll = () => {
             const parallaxElements = document.querySelectorAll('.home-img, .card');
             parallaxElements.forEach(parallax => {
                 let scrollPosition = window.pageYOffset;
                 parallax.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
             });
         };
 
         window.addEventListener('scroll', handleScroll);
 
         return () => {
             window.removeEventListener('scroll', handleScroll);
         };
     }, []);

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} /> {/* Login */}
          <Route path='/register' element={<Register/>} />
        <Route path="/bands" element={<Bands />} />
        <Route path="/concierts" element={<Concierts />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  
  )
}

export default App
