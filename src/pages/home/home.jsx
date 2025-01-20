import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

import './home.css';

export const Home = () => {


    return (
        <div className="home-container">
            <Header />
            <section className='home-content'>
                <div className='home-img'>
                    <h1>Welcome to Magnus</h1>
                    <p>Find your favorite bands and concerts in one place!</p>
                </div>
            </section>

            <section className='home-about'>
                <article className='home-about-content-text'>
                    <p>Magnus is a platform where users can discover new bands, concerts, and news related to their favorite artists. Join us today and discover your next favorite show!</p>
                </article>

                <div className='card-container'>
                    <div className='card'>
                        <div className='card-text-impulsa'>
                        <h2>Impulsa el talento emergente</h2>
                        <p>Descubre y apoya a las mejores bandas emergentes del metal colombiano. Nuestra plataforma está diseñada para que el talento independiente brille y conecte con fanáticos apasionados como tú.</p>
                        </div>
                    </div>

                    <div className='card'>
                        <div className='card-text-conect'>
                        <h2>Conecta música y comunidad</h2>
                        <p>Únete a una comunidad que comparte tu pasión. Descubre, comparte y apoya la escena metalera local mientras disfrutas de contenido exclusivo y te mantienes al día con eventos y lanzamientos.</p>
                        </div>
                    </div>




                    <div className='card'>
                        <div className='card-text-experience'>
                        <h2>Una experiencia 100% dedicada al metal</h2>
                        <p>Somos más que una app de música: somos el hogar de los amantes del metal. Escucha canciones exclusivas, explora nuevos sonidos y vive el poder del metal en todas sus formas.</p>
                        </div>
                    </div>


                </div>
            </section>
            <section className='home-Artist'>

            </section>
            <Footer />

        </div>
    );
};