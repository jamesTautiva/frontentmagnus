
import React, { useState } from 'react';
import axios from 'axios';
import './createAlbum.css';

export const CreateAlbum = ({ isModalOpen, closeModal }) => {
    if (!isModalOpen) return null;

    // Album (step 1) state
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        producer: '',
        genre: '',
        license: 'CC-BY',
        licenseUrl: '',
    });
    const [coverFile, setCoverFile] = useState(null);

    // Song (step 2) state
    const [albumId, setAlbumId] = useState(null);
    const [artistId, setArtistId] = useState(null);
    const [albumCreated, setAlbumCreated] = useState(null);
    const [songs, setSongs] = useState([]);
    const [newSong, setNewSong] = useState({
        title: '',
        trackNumber: '',
        explicit: false,
        composers: '',
        license: 'CC-BY',
        licenseUrl: '',
    });
    const [songFile, setSongFile] = useState(null);
    const [message, setMessage] = useState('');

    // Handlers for album fields
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleFileChange = (e) => setCoverFile(e.target.files[0]);

    // Handlers for song fields
    const handleSongChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewSong((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleSongFile = (e) => setSongFile(e.target.files[0]);

    // Step 1: create album
    const handleSubmitAlbum = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = sessionStorage.getItem('token');
        const artistDataString = localStorage.getItem('artistData');
        if (!artistDataString) {
            setMessage('Error: Artista no disponible.');
            return;
        }
        const artistData = JSON.parse(artistDataString);
        const localArtistId = artistData.id;
        if (!localArtistId || !token) {
            setMessage('Error: Artista o token no disponible.');
            return;
        }
        if (!formData.title || !formData.year || !formData.genre || !formData.license || !formData.licenseUrl) {
            setMessage('Faltan campos obligatorios.');
            return;
        }
        try {
            const payload = {
                ...formData,
                year: parseInt(formData.year, 10),
                artistId: parseInt(localArtistId, 10),
            };
            const res = await axios.post('https://blackamp-api.onrender.com/albums', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const createdAlbum = res.data?.album || res.data;
            const id = createdAlbum?.id;
            if (!id) {
                setMessage('No se recibió ID del álbum creado.');
                return;
            }
            if (coverFile) {
                const fd = new FormData();
                fd.append('file', coverFile);
                await axios.post(`https://blackamp-api.onrender.com/upload/albums/${id}`, fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setAlbumId(id);
            setArtistId(payload.artistId);
            setAlbumCreated(createdAlbum);
            setNewSong((prev) => ({
                ...prev,
                license: createdAlbum.license || formData.license,
                licenseUrl: createdAlbum.licenseUrl || formData.licenseUrl,
            }));
            setMessage('✅ Álbum creado. Ahora puedes agregar canciones.');
        } catch (err) {
            console.error('Error creando álbum:', err);
            setMessage(err.response?.data?.error || 'Error al crear álbum.');
        }
    };

    // Step 2: add song
    const handleAddSong = async (e) => {
        e.preventDefault();
        setMessage('');
        const token = sessionStorage.getItem('token');
        if (!albumId || !artistId) {
            setMessage('Primero debes crear un álbum.');
            return;
        }
        if (!newSong.title) {
            setMessage('La canción necesita un título.');
            return;
        }
        if (!newSong.license || !newSong.licenseUrl) {
            setMessage('Licencia y URL son obligatorios.');
            return;
        }
        if (!songFile) {
            setMessage('Selecciona un archivo de audio.');
            return;
        }
        try {
            const songPayload = {
                title: newSong.title,
                trackNumber: newSong.trackNumber ? parseInt(newSong.trackNumber, 10) : null,
                explicit: newSong.explicit,
                composers: newSong.composers || null,
                albumId,
                artistId,
                license: newSong.license,
                licenseUrl: newSong.licenseUrl,
            };
            const res = await axios.post('https://blackamp-api.onrender.com/songs', songPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const createdSong = res.data?.song || res.data;
            const songId = createdSong?.id;
            if (!songId) {
                setMessage('No se recibió ID de la canción creada.');
                return;
            }
            const fd = new FormData();
            fd.append('file', songFile);
            const uploadRes = await axios.post(`https://blackamp-api.onrender.com/upload/songs/${songId}`, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            const audioUrl = uploadRes.data?.url || uploadRes.data?.fileUrl || null;
            if (audioUrl) createdSong.audioUrl = audioUrl;
            setSongs((prev) => [...prev, createdSong]);
            setNewSong({
                title: '',
                trackNumber: '',
                explicit: false,
                composers: '',
                license: albumCreated?.license || formData.license,
                licenseUrl: albumCreated?.licenseUrl || formData.licenseUrl,
            });
            setSongFile(null);
            setMessage('🎵 Canción agregada correctamente.');
        } catch (err) {
            console.error('Error agregando canción:', err);
            setMessage(err.response?.data?.error || 'Error al agregar canción.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={closeModal}>✖</button>
                <h1>Crear Álbum</h1>
                {/* Step 1 */}
                {!albumId && (
                    <form onSubmit={handleSubmitAlbum} className="create-album-form">
                        <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} required />
                        <input name="year" type="number" placeholder="Año" value={formData.year} onChange={handleChange} required />
                        <input name="producer" placeholder="Productor" value={formData.producer} onChange={handleChange} />
                        <input name="genre" placeholder="Género" value={formData.genre} onChange={handleChange} required />
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <select name="license" value={formData.license} onChange={handleChange} required>
                            <option value="CC0">CC0</option>
                            <option value="CC-BY">CC-BY</option>
                            <option value="CC-BY-SA">CC-BY-SA</option>
                            <option value="CC-BY-NC">CC-BY-NC</option>
                            <option value="CC-BY-ND">CC-BY-ND</option>
                            <option value="CC-BY-NC-SA">CC-BY-NC-SA</option>
                            <option value="CC-BY-NC-ND">CC-BY-NC-ND</option>
                        </select>
                        <input name="licenseUrl" placeholder="URL licencia" value={formData.licenseUrl} onChange={handleChange} required />
                        <button type="submit">Crear Álbum</button>
                    </form>
                )}
                {/* Step 2 */}
                {albumId && (
                    <>
                        <h2>Agregar canciones</h2>
                        <form onSubmit={handleAddSong} className="create-album-form">
                            <input name="title" placeholder="Título canción" value={newSong.title} onChange={handleSongChange} required />
                            <input name="trackNumber" type="number" placeholder="Track #" value={newSong.trackNumber} onChange={handleSongChange} />
                            <label>
                                Explícita:
                                <input type="checkbox" name="explicit" checked={newSong.explicit} onChange={handleSongChange} />
                            </label>
                            <input name="composers" placeholder="Compositores" value={newSong.composers} onChange={handleSongChange} />
                            <select name="license" value={newSong.license} onChange={handleSongChange} required>
                                <option value="CC0">CC0</option>
                                <option value="CC-BY">CC-BY</option>
                                <option value="CC-BY-SA">CC-BY-SA</option>
                                <option value="CC-BY-NC">CC-BY-NC</option>
                                <option value="CC-BY-ND">CC-BY-ND</option>
                                <option value="CC-BY-NC-SA">CC-BY-NC-SA</option>
                                <option value="CC-BY-NC-ND">CC-BY-NC-ND</option>
                            </select>
                            <input name="licenseUrl" placeholder="URL licencia" value={newSong.licenseUrl} onChange={handleSongChange} required />
                            <input type="file" accept="audio/*" onChange={handleSongFile} required />
                            <button type="submit">Agregar canción</button>
                        </form>
                        <ul>
                            {songs.map((s) => (
                                <li key={s.id}>
                                    {s.trackNumber ? `${s.trackNumber}. ` : ''}{s.title}
                                    {s.explicit && ' 🔞'}
                                    {s.audioUrl && (
                                        <a href={s.audioUrl} target="_blank" rel="noreferrer">[escuchar]</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};