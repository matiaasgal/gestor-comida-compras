import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Inventario from './pages/Inventario';
import Analisis from './pages/Analisis';
import Navbar from './components/Navbar.jsx';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Ruta pública: Login */}
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                
                {/* Ruta privada: Solo entras si estás logueado */}
                <Route 
                    path="/inventario" 
                    element={
                        <PrivateRoute>
                            <Navbar />
                            <Inventario />
                        </PrivateRoute>
                    } 
                />
                <Route 
                    path="/analisis" 
                    element={
                        <PrivateRoute>
                            <Navbar />
                            <Analisis />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;