import { useState } from 'react';
import axios from 'axios';
import videoBg from '../../../assets/video/CHILE 2017-2018.mp4';
import './formRegister.css';

export const FormRegister = () => {
    const [preview, setPreview] = useState(null);

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'artist',
    image: null
  });

  const [artistFormData, setArtistFormData] = useState({
    name: '',
    description: '',
    genere: '',
    linkFacebook: '',
    linkInstagram: '',
    linkYoutube: ''
  });

  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleUserChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setUserFormData({ ...userFormData, image: files[0] });
    } else {
      setUserFormData({ ...userFormData, [name]: value });
    }
  };

  const handleArtistChange = (e) => {
    const { name, value } = e.target;
    setArtistFormData({ ...artistFormData, [name]: value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const { name, email, password, role, image } = userFormData;

      const userRes = await axios.post('https://blackamp-api.onrender.com/auth/register', {
        name,
        email,
        password,
        role
      });

      // extraer id de forma segura según la posible forma de la respuesta
      const userId =
        userRes?.data?.user?.id ??
        userRes?.data?.id ??
        userRes?.data?.userId;

      if (!userId) {
        console.error('No se obtuvo userId en la respuesta:', userRes?.data);
        alert('No se pudo obtener el id del usuario creado.');
        return;
      }

      const token = localStorage.getItem('token');
      localStorage.setItem('newArtistUserId', userId);

      if (image) {
        const imageData = new FormData();
        imageData.append('file', image);
        await axios.post(`https://blackamp-api.onrender.com/upload/users/${userId}`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
      }

      // flujo actual: avanzar al paso 2 para rellenar perfil de artista
      setStep(2);

      // Si prefieres redirigir inmediatamente a la lista en vez de crear perfil:
      // if (typeof setSelectedContent === 'function') setSelectedContent('list-artists');

    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error creating user');
    } finally {
      setCreating(false);
    }
  };

  const handleArtistSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const {
        name,
        description,
        genere,
        linkFacebook,
        linkInstagram,
        linkYoutube
      } = artistFormData;

      const userId = parseInt(localStorage.getItem('newArtistUserId'), 10);
      if (Number.isNaN(userId)) {
        alert('Id de usuario inválido. Vuelve a crear el usuario.');
        return;
      }

      const token = localStorage.getItem('token');

      await axios.post(
        'https://blackamp-api.onrender.com/artists',
        {
          name,
          description,
          genere,
          linkFacebook,
          linkInstagram,
          linkYoutube,
          userId
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );

      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);

        localStorage.removeItem('newArtistUserId');
      }, 1500);
    } catch (err) {
      console.error('Error creating artist profile:', err);
      alert('Error creating artist profile');
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('newArtistUserId');
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Crea una URL temporal para mostrar la previsualización
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
        <div className="form-register-container">
            <div className="background-form-register">
            <video
                src={videoBg}
                autoPlay
                loop
                muted
                playsInline
                className="video-background"
            />
            </div>

        <div className="edit-user-container">
      <div className="list-user-direction">
        <h1>{step === 0 ? 'Add Artist User' : 'Create Artist Profile'}</h1>
        <p>create profile artist- Step {step}</p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleUserSubmit} className="edit-user-form">
          <label>Name Artist:
            <input type="text" name="name" value={userFormData.name} onChange={handleUserChange} required />
          </label>
          <label>Email:
            <input type="email" name="email" value={userFormData.email} onChange={handleUserChange} required />
          </label>
          <label>Password:
            <input type="password" name="password" value={userFormData.password} onChange={handleUserChange} required />
          </label>
 

           <div className="image-uploader">
      <label htmlFor="file-input" className="upload-label">
    Seleccionar imagen
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Vista previa" />
        </div>
      )}
    </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={creating}>
              {creating ? 'Creating...' : 'Next'}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleArtistSubmit} className="edit-user-form">
          <label>Artist Name:
            <input type="text" name="name" value={artistFormData.name} onChange={handleArtistChange} required />
          </label>
          <label>Description:
            <textarea name="description" value={artistFormData.description} onChange={handleArtistChange} />
          </label>
          <label>Genre:
            <input type="text" name="genere" value={artistFormData.genere} onChange={handleArtistChange} />
          </label>
          <label>Facebook Link:
            <input type="url" name="linkFacebook" value={artistFormData.linkFacebook} onChange={handleArtistChange} />
          </label>
          <label>Instagram Link:
            <input type="url" name="linkInstagram" value={artistFormData.linkInstagram} onChange={handleArtistChange} />
          </label>
          <label>YouTube Link:
            <input type="url" name="linkYoutube" value={artistFormData.linkYoutube} onChange={handleArtistChange} />
          </label>

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={creating}>
              {creating ? 'Creating...' : 'Create Artist Profile'}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal success">
            <h3>Artist created successfully</h3>
          </div>
        </div>
      )}
    </div>

    </div>
  );
};