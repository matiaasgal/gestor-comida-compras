import api from '../api/axios';
import { useEffect, useState } from 'react';
import '../styles/Analisis.css'


const Analisis = () => {
    const [compras, setCompras] = useState([]);
    const [consumos, setConsumos] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr);
        const dia = fecha.getDate();
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mes = meses[fecha.getMonth()];
        return `${dia} ${mes}`;
    };

    const cargarDatos = async () => {
        try {
            const responseCompras = await api.get('/productos/obtener-compras');
            const responseConsumos = await api.get('/productos/obtener-consumos');
            setCompras(responseCompras.data);
            setConsumos(responseConsumos.data);
        } catch (error) {
            let titulo = "Error al cargando productos";
            let mensaje = "Intente más tarde";

            if (error.response) {
                const status = error.response.status;
                
                if (status === 401) {
                    titulo = "Sesión expirada";
                    mensaje = "Vuelve a iniciar sesión para continuar.";
                } else if (status === 500) {
                    titulo = "Problema en el servidor";
                    mensaje = "Tenemos problemas en nuestros servicios, intente mas tarde.";
                }
            }

            Swal.fire({
                title: titulo,
                text: mensaje,
                icon: 'error',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: "#DD6B55",
                timer: 4000,
                customClass: {
                    container: 'my-swal-container',
                    popup: 'my-swal-popup',
                    title: 'my-swal-title',
                    confirmButton: 'my-swal-confirm',
                    icon: 'my-swal-icon'
                },
                buttonsStyling: false
            });
        }
    };

    return (
        <div className="data-container">
            <h3>Tabla de compras</h3>
            {compras.length === 0 ? (
                <div className="no-data-card">
                    <p>No tienes compras registradas.</p>
                </div>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Stock Inicial</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.map((compra) => (
                                <tr key={compra.id}>
                                    <td>
                                        <span>{compra.nombre}</span>
                                    </td>
                                    <td>
                                        <span>{compra.cantidad}</span>
                                    </td>
                                    <td>
                                        <span>
                                            {formatearFecha(compra.fecha_compra)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <hr />

            <h3>Tabla de consumos</h3>
            {consumos.length === 0 ? (
                <div className="no-data-card">
                    <p>No tienes consumos registrados.</p>
                </div>
            ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Stock gastado </th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consumos.map((consumo) => (
                                <tr key={consumo.id}>
                                    <td>
                                        <span>{consumo.nombre}</span>
                                    </td>
                                    <td>
                                        <span>{consumo.cantidad_gastada}</span>
                                    </td>
                                    <td>
                                        <span>
                                            {formatearFecha(consumo.fecha_consumo)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Analisis;