import { useEffect, useState } from 'react';
import axios from 'axios';
import { CreateAlbum } from './createAlbum/createAlbum';
import { DetailAlbum } from './detailAlbum/detailAlbum';
// Importamos el nuevo componente para la confirmación de eliminación
import { ConfirmModal } from './confirmModal/confirmModal';
import './contentArtist.css';

export const ContentArtist = () => {
    // Estado principal
    const [albums, setAlbums] = useState([]);
    const [artistName, setArtistName] = useState('');

    // Estados para el Modal de Crear Álbum
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    // Estados para el Modal de Ver Detalles
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    // Guarda el ID del álbum que se va a ver
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);

    const openDetailModal = (albumId) => {
        setSelectedAlbumId(albumId);
        setIsDetailModalOpen(true);
    };
    const closeDetailModal = () => {
        setSelectedAlbumId(null);
        setIsDetailModalOpen(false);
    };

    // Estados para el Modal de Eliminar Álbum (Confirmación)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Guarda el ID del álbum que se va a eliminar
    const [albumToDeleteId, setAlbumToDeleteId] = useState(null);

    const openDeleteModal = (albumId) => {
        setAlbumToDeleteId(albumId);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => {
        setAlbumToDeleteId(null);
        setIsDeleteModalOpen(false);
    };



    // --- Funciones de Fetching (Mantengo el código original) ---
    // ... (Tu código useEffect para fetchArtistName y fetchAlbums)
    useEffect(() => {
        const fetchArtistName = async () => {
            const token = sessionStorage.getItem('token');
            const artistDataString = localStorage.getItem('artistData');
            if (!artistDataString) return console.error('No artist data found in localStorage');
            const artistData = JSON.parse(artistDataString);
            const idArtist = artistData.id;
            if (!idArtist) return console.error('No artist ID found in artistData');
            try {
                const response = await axios.get(`https://blackamp-api.onrender.com/artists/${idArtist}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArtistName(response.data.name);
            } catch (error) {
                console.error('Error fetching artist name:', error);
            }
        };

        const fetchAlbums = async () => {
            const token = sessionStorage.getItem('token');
            const artistDataString = localStorage.getItem('artistData');
            if (!artistDataString) return console.error('No artist data found in localStorage');
            const artistData = JSON.parse(artistDataString);
            const idArtist = artistData.id;
            if (!idArtist) return console.error('No artist ID found in artistData');
            try {
                const response = await axios.get(`https://blackamp-api.onrender.com/albums/artist/${idArtist}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlbums(response.data);
            } catch (error) {
                console.error('Error fetching albums:', error);
            }
        };

        fetchArtistName();
        fetchAlbums();
    }, []);
    // -----------------------------------------------------------

    // Función para manejar el color del estatus (mejorado con clases CSS)
    const getStatusClassName = (status) => {
        switch (status) {
            case 'pending':
                return 'status-pending'; // Amarillo
            case 'approved':
                return 'status-approved'; // Verde
            case 'denied':
                return 'status-denied'; // Rojo
            default:
                return 'status-default';
        }
    };

    // Lógica de eliminación (ejecutada al confirmar en el modal)
    const handleConfirmDeleteAlbum = async () => {
        const albumId = albumToDeleteId;
        closeDeleteModal(); // Cierra el modal de confirmación
        if (!albumId) return;

        const token = sessionStorage.getItem('token');
        console.log('Intentando eliminar álbum:', { albumId, token: token ? 'Presente' : 'Faltante' });

        try {
            await axios.delete(`https://blackamp-api.onrender.com/albums/${albumId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Album eliminado correctamente');
            // Actualiza la lista de álbumes
            setAlbums((prev) => prev.filter((a) => a.id !== albumId));
        } catch (error) {
            console.error('Error al eliminar el album:', error);
            alert('Error al eliminar el album');
        }
    };

    return (
        <section className="content-artist">
            <h2>Albums {artistName}</h2>
            <div className="albums-controllers">
                <button onClick={openCreateModal} className="btn-primary">Crear Album</button>
            </div>

            {/* Lista de Álbumes */}
            <div className="albums-grid">
                {albums.map((album) => (
                    <div key={album.id} className="album-card">
                        <img src={album.coverUrl} alt={`Cover de ${album.title}`} className="album-cover" />
                        <div className="album-details">
                            <h3>{album.title}</h3>
                            <p>Género: {album.genere}</p>
                            <p>Año: {album.year}</p>
                            <p>Productor: {album.producer}</p>
                            <p className={`album-status ${getStatusClassName(album.status)}`}>{album.status}</p>
                        </div>
                        <div className="album-actions">
                            {/* Botón Ver: Abre el modal de detalles */}
                            <button onClick={() => openDetailModal(album.id)} className="btn-secondary">Ver</button>
                            {/* Botón Eliminar: Abre el modal de confirmación */}
                            <button onClick={() => openDeleteModal(album.id)} className="btn-danger">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modales */}
            <CreateAlbum isModalOpen={isCreateModalOpen} closeModal={closeCreateModal} />

            {/* El modal de detalles se abre si isDetailModalOpen es true Y selectedAlbumId tiene un valor */}
            {isDetailModalOpen && (
                <DetailAlbum
                    isModalOpen={isDetailModalOpen}
                    closeModal={closeDetailModal}
                    albumId={selectedAlbumId}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmModal
                isModalOpen={isDeleteModalOpen}
                closeModal={closeDeleteModal}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este álbum permanentemente? Esta acción es irreversible."
                onConfirm={handleConfirmDeleteAlbum}
                confirmButtonText="Sí, Eliminar"
            />
        </section>
    );
};