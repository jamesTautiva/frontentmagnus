import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './formRegister.css';

export const FormRegister = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.last_name || !formData.email || !formData.password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        try {
            const response = await axios.post('https://backendapimusic-production.up.railway.app/api/users', {
                name: formData.name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            }
            );

            navigate('/login');

            
            setError('');
            setFormData({
                name: '',
                last_name: '',
                email: '',
                password: '',
            });
            

            

            alert('Registro exitoso!');
            console.log('Registro exitoso:', response.data);
            
        } catch (error) {
            console.error('Error en el registro:', error);
            setError('Ha ocurrido un error en el registro.');
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className='form-register'>
                <div className=''>
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                />
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};