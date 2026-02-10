import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Register.css'

const Registro = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleIsLoading = (value) => {
        setIsLoading(value);
    }

    const handleRegistro = async (e) => {
        e.preventDefault();
        handleIsLoading(true);
        try {
            await api.post('/auth/registrar', { email, password });
            alert("¡Cuenta creada! Ahora puedes iniciar sesión.");
            navigate('/'); 
        } catch (error) {
            Swal.fire({
                title: 'Error al registrar!',
                text: `Intente mas tarde`,
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
        <div className='register-container'>
            <div className='register-card'>
                <h2 className='register-title'>👤 Crear Cuenta</h2>
                <p className='register-subtitle'>Únete para organizar tu comida</p>
                
                <form onSubmit={handleRegistro} className='register-form'>
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        className='register-input'
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        className='register-input'
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className={`register-button ${isLoading ? 'login-button--disabled' : ''}`} disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Registrar'}
                    </button>
                </form>

                <div className='register-footer'>
                    <span>¿Ya tienes cuenta? </span>
                    <Link to="/" className='register-link'>Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default Registro;