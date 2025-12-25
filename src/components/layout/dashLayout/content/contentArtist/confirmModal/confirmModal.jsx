
import './confirmModal.css'

export const ConfirmModal = ({ isModalOpen, closeModal, title, message, onConfirm, confirmButtonText = 'Confirmar' }) => {
    if (!isModalOpen) return null;

    const handleConfirm = () => {
        onConfirm(); // Ejecuta la acción de eliminación
        // El closeModal se ejecuta dentro de handleConfirmDeleteAlbum en ContentArtist después de la lógica
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={closeModal} className="btn-secondary">Cancelar</button>
                    <button onClick={handleConfirm} className="btn-danger">{confirmButtonText}</button>
                </div>
            </div>
        </div>
    );
};