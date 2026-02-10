import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import api from '../api/axios';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleIsLoading = (value) => {
        setIsLoading(value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        handleIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/inventario');
        } catch (error) {
            Swal.fire({
                title: 'Error al iniciar sesion!',
                text: `Revise si sus credenciales estan correctas`,
                icon: 'error',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: "#DD6B55",
                timer: 3000,
            })
        } finally {
            handleIsLoading(false);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-card'>
                <h2 className='login-title'>🍔 Mi Despensa</h2>
                <p className='login-subtitle'>Inicia sesión para gestionar tu comida</p>
                
                <form onSubmit={handleLogin} className='login-form'>
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        className='login-input'
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        className='login-input'
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className={`login-button ${isLoading ? 'login-button--disabled' : ''}`} disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Entrar'}
                    </button>
                </form>

                <div className='login-footer'>
                    <span>¿No tienes cuenta? </span>
                    <Link to="/registro" className='login-link'>Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;