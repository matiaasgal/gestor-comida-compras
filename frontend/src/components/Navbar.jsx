import { Link, useNavigate } from 'react-router-dom';
import offIcon from '../assets/power-off-icon.svg';
import '../styles/Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="navbar-container">
            <nav className='inventario-header'>
                <h2 className='inventario-title'>🍔 Mi Despensa</h2>
                
                <div className='nav-links'>
                    <Link to="/inventario" className='nav-link'>Inventario</Link>
                    <Link to="/analisis" className='nav-link'>Análisis</Link>
                </div>

                <button onClick={cerrarSesion} className='inventario-logout'>
                    <h3>Cerrar Sesión</h3>
                    <img src={offIcon} alt="Log out icon" />
                </button>
            </nav>
        </div>
    );
};

export default Navbar;