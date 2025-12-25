// detailAlbum/DetailAlbum.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player'; // Librería de reproducción
import './detailAlbum.css'; // CSS elegante para el modal

export const DetailAlbum = ({ isModalOpen, closeModal, albumId }) => {
    const [albumDetails, setAlbumDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch de los detalles del álbum
    useEffect(() => {
        if (!albumId || !isModalOpen) {
            setAlbumDetails(null);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            const token = sessionStorage.getItem('token');
            try {
                // Asumo que tienes un endpoint para obtener los detalles de un álbum por ID,
                // incluyendo la lista de canciones y sus URLs.
                const response = await axios.get(`https://blackamp-api.onrender.com/albums/${albumId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlbumDetails(response.data);
            } catch (err) {
                console.error('Error fetching album details:', err);
                setError('No se pudieron cargar los detalles del álbum.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [albumId, isModalOpen]);

    if (!isModalOpen) return null;

    // registrar al reproducir una cancion
    const registerPlay = async (songId) => {
        const token = sessionStorage.getItem('token');
        console.log('Registrando reproducción:', { songId, token: token ? 'Presente' : 'Faltante' });

        try {
            await axios.post(`https://blackamp-api.onrender.com/songplays/register`, { songId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Reproducción registrada correctamente');
        } catch (error) {
            console.error('Error al registrar la reproducción:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                console.error('Status:', error.response.status);
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content detail-album-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeModal}>&times;</button>

                {loading && <p className="loading-message">Cargando detalles del álbum...</p>}
                {error && <p className="error-message">{error}</p>}

                {albumDetails && (
                    <div className="album-details-container">
                        {/* Cabecera del Álbum */}
                        <div className="album-header">
                            <img src={albumDetails.coverUrl} alt={`Cover de ${albumDetails.title}`} className="detail-album-cover" />
                            <div className="album-info">
                                <h2>{albumDetails.title}</h2>
                                <p><strong>Productor:</strong> {albumDetails.producer}</p>
                                <p><strong>Género:</strong> {albumDetails.genere}</p>
                                <p><strong>Año:</strong> {albumDetails.year}</p>
                                <p className={`detail-status ${albumDetails.status}`}>{albumDetails.status.toUpperCase()}</p>
                            </div>
                        </div>

                        <hr className="divider" />

                        {/* Lista de Canciones */}
                        <div className="songs-list">
                            <h3> Lista de Canciones</h3>
                            {/* Asumo que albumDetails.songs es un array de objetos con { title, audioUrl } */}
                            {albumDetails.songs && albumDetails.songs.length > 0 ? (
                                albumDetails.songs.map((song, index) => (
                                    <div key={index} className="song-item">
                                        <p className="song-title">{index + 1}. {song.title}</p>
                                        {/* Componente de Reproductor de Audio */}
                                        <ReactAudioPlayer
                                            src={song.audioUrl} // URL del archivo de audio
                                            controls // Muestra los controles de reproducción
                                            className="audio-player"
                                            onPlay={() => registerPlay(song.id)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>Este álbum no tiene canciones registradas.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};