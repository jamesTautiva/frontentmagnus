import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaUserCheck, FaCompactDisc, FaListUl } from 'react-icons/fa';
import './control.css'

export function Control() {
    //traer datos del usuario logueado
    const userData = JSON.parse(sessionStorage.getItem('user'));
    const [artist, setArtist] = useState(null);
    console.log('Datos del usuario logueado en Control:', userData);

    useEffect(() => {
        //por medio del user data traer los datos del artista
        const fetchArtistData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`https://blackamp-api.onrender.com/artists/user/${userData.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                //
                const artistData = await response.data;
                console.log('Datos del artista en Control:', artistData);
                setArtist(artistData);
                localStorage.setItem('artistData', JSON.stringify(artistData));
            }
            catch (error) {
                console.error('Error al traer los datos del artista en Control:', error);
            }
        }
        if (userData?.id) {
            fetchArtistData();
        }

    }, [userData?.id])


    return (
        <nav className="panel-control">
            <div className='artist-image'>
                <img src={userData.imageUrl} alt="" />

            </div>

            <div className='artist'>
                {/* traer datos del artista */}
                {artist && (
                    <div className='artist-container'>
                        <h2>{artist.name}</h2>

                        


                        {/* Render artist data here as needed */}

                        <div className='artist-data' >
                            <div className='user-data'>
                                <p>{userData.email}</p>

                            </div>
                            <div className='artist-info'>
                                <p> Descripción: {artist.description}</p>
                                <p> Genero: {artist.genere}</p>
                                <div>
                                    <p>Facebook: {artist.linkFacebook}</p>
                                    <p>Instagram: {artist.linkInstagram}</p>
                                    <p>Youtube: {artist.linkYoutube}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className='analytics'>
                    <h2>Analytics</h2>
                    <div className='analytics-data'>
                        <div className='analytics-users'>
                            <div>
                                <p>Seguidores</p>
                                <p>505</p>
                            </div>
                            <div>
                                <p>Veces escuchado</p>
                                <p>123212</p>
                            </div>
                        </div>
                        <div>
                            <p> Albums</p>
                            
                        </div>
                        <div>
                            <p> Playlists</p>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}