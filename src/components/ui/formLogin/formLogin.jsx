import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './formLogin.css'

export const FormLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email ||!formData.password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        try { 
            const response = await axios.post('https://backendapimusic-production.up.railway.app/api/login',{
                email: formData.email,
                password: formData.password,
            })

            console.log('ingreso exitoso', response)

            /*sesion storage*/ 
            sessionStorage.setItem('token', response.data.access_token);
            sessionStorage.setItem('user', JSON.stringify(response.data.user));

                navigate('/dashboard', {
                    replace: true,
                    state: {
                    logged: true,
                    user: response.data.user,
                    token: response.data.token,
                    id: response.data.user.id
                    
                    }
                });
            alert('Ingreso exitoso!');
            console.log('Ingreso exitoso:', response.data);
                        
            setError('');
            setFormData({
                email: '',
                password: '',
            });
            
        }
        catch (error) {
            console.error('Error en el login:', error);
            setError('Ha ocurrido un error en el login.');
        }
    }

    return (
<div className="form-container-login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className='form-login'>

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
    )
}