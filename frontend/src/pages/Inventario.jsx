import { useEffect, useState } from 'react';
import api from '../api/axios';
import '../styles/Inventario.css'
import trashIcon from '../assets/trash-icon.svg';
import pencilIcon from '../assets/pencil-icon.svg';

const Inventario = () => {
    const [productos, setProductos] = useState([]);
    const [nuevoProd, setNuevoProd] = useState({ nombre: '', stock_inicial: '', unidad: ''  });
    const [cantidades, setCantidades] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleIsLoading = (value) => {
        setIsLoading(value);
    }

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const response = await api.get('/productos/inventario');
            setProductos(response.data);
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

    const manejarMovimiento = async (producto_id, cantidad, tipo) => {
        if (cantidad ==='' || cantidad == NaN || cantidad === undefined) {
            Swal.fire({
                title: "Debe agregar un valor",
                text: "No puede registrar un movimiento sin valor.",
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
            return;
        }
        try {
            await api.post(`/productos/${tipo}`, { producto_id, cantidad });
            const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            Toast.fire({ icon: 'success', title: 'Movimiento guardado' });
            cargarProductos();
        } catch (error) {
            let titulo = "Error al registrar movimiento";
            let mensaje = "Intente más tarde";

            if (error.response) {
                const status = error.response.status;
                
                if (status === 400) {
                    titulo = "Datos inválidos";
                    mensaje = "Revisa que los campos tengan el formato correcto.";
                } else if (status === 401) {
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

    const eliminarProducto = (producto_id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás deshacer esta decisión!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sí, eliminar",
            reverseButtons: true,

            customClass: {
                container: 'my-swal-container',
                popup: 'my-swal-popup',
                title: 'my-swal-title',
                confirmButton: 'my-swal-confirm',
                cancelButton: 'my-swal-cancel',
                icon: 'my-swal-icon'
            },
            buttonsStyling: false

        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/productos/eliminar`, { data: {producto_id} });
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'bottom',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    Toast.fire({ icon: 'success', title: 'Producto eliminado' });
                    cargarProductos();
                } catch (error) {
                    let titulo = "Error al eliminar";
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
            }
        })
    }

    const crearProducto = async (e) => {
        e.preventDefault();
        handleIsLoading(true);
        try {
            // console.log(nuevoProd);
            if(nuevoProd.stock_inicial < 0) {
                Swal.fire({
                    title: 'Error en el stock',
                    text: 'No puede tener stock negativo.',
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
                return;
            }
            await api.post('/productos/crear', nuevoProd);
            const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            Toast.fire({ icon: 'success', title: 'Producto creado' });
            setNuevoProd({ nombre: '', stock_inicial: 0, unidad: '' });
            cargarProductos();
        } catch (error) {
            let titulo = "Error al crear producto";
            let mensaje = "Intente más tarde";

            if (error.response) {
                const status = error.response.status;
                
                if (status === 400) {
                    titulo = "Datos inválidos";
                    mensaje = "Revisa que los campos tengan el formato correcto.";
                } else if (status === 401) {
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
        } finally {
            handleIsLoading(false);
        }
    };

    const editarProducto = (producto) => {
        setIsEditing(true);
        setProductoEditando({...producto});
    }

    const guardarEditado = async (e) => {
        e.preventDefault();
        handleIsLoading(true);
        try {
            // console.log(productoEditando);
            if(productoEditando.stock_actual < 0) {
                Swal.fire({
                    title: 'Error en el stock',
                    text: 'No puede tener stock negativo.',
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
                return;
            }
            await api.put(`/productos/actualizar`, productoEditando);
            const Toast = Swal.mixin({
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
            });
            Toast.fire({ icon: 'success', title: 'Producto actualizado' });
            setIsEditing(false);
            setProductoEditando(null);
            cargarProductos();
        } catch (error) {
            let titulo = "Error al actualizar";
            let mensaje = "Intente más tarde";

            if (error.response) {
                const status = error.response.status;
                
                if (status === 400) {
                    titulo = "Datos inválidos";
                    mensaje = "Revisa que los campos tengan el formato correcto.";
                } else if (status === 404) {
                    titulo = "No encontrado";
                    mensaje = "El producto no existe o no tienes permiso para editarlo.";
                } else if (status === 401) {
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
        } finally {
            handleIsLoading(false);
        }
    }

    const cancelarEdicion = () => {
        setIsEditing(false);
        setProductoEditando(null);
    };

    const productosFiltrados =
        searchTerm.trim() === '' ? productos : productos.filter(
            (prod) => prod.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase()));


    return (
        <div className='inventario-container'>
            {/* Formulario para añadir/editar productos */}
            <section className='inventario-anadir-prod'>
                {!isEditing ? (
                    <>
                        <h3 className='inventario-anadir-prod-title'>Nuevo Producto</h3>
                        <form onSubmit={crearProducto} className='inventario-form'>
                            <input className='inventario-form-input' type="text" placeholder="Nombre" value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} required />
                            <input className='inventario-form-input' type="number" placeholder="Stock inicial" value={nuevoProd.stock_inicial} onChange={e => setNuevoProd({...nuevoProd, stock_inicial: e.target.value})} />
                            <select className='inventario-form-input' name="tipo-comida" id="tipo-comida" value={nuevoProd.unidad} onChange={e => setNuevoProd({...nuevoProd, unidad: e.target.value})}>
                                <option value="none">Seleccione una opción...</option>
                                <option value="unidades">unidades</option>
                                <option value="latas">latas</option>
                                <option value="paquetes">paquetes</option>
                                <option value="kg">kg</option>
                                <option value="gramos">gramos</option>
                            </select>
                            <button type="submit" className={`inventario-add-btn ${isLoading ? 'inventario-add-btn--disabled' : ''}`} disabled={isLoading}>
                                {isLoading ? 'Cargando...' : 'Guardar'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h3>Editar Producto</h3>
                        <form onSubmit={guardarEditado} className='inventario-form'>
                            <input 
                            className='inventario-form-input' 
                            type="text" 
                            placeholder="Nombre" 
                            value={productoEditando?.nombre || ''} 
                            onChange={e => setProductoEditando({...productoEditando, nombre: e.target.value})} 
                            required 
                            />
                            <input 
                            className='inventario-form-input' 
                            type="number" 
                            placeholder="Stock actual" 
                            value={productoEditando?.stock_actual || ''} 
                            onChange={e => setProductoEditando({...productoEditando, stock_actual: e.target.value})} 
                            />
                            <select 
                            className='inventario-form-input' 
                            value={productoEditando?.unidad || ''} 
                            onChange={e => setProductoEditando({...productoEditando, unidad: e.target.value})}
                            >
                            <option value="none">Seleccione una opción...</option>
                            <option value="unidades">unidades</option>
                            <option value="latas">latas</option>
                            <option value="paquetes">paquetes</option>
                            <option value="kg">kg</option>
                            <option value="gramos">gramos</option>
                            </select>
                            <div className='div-controls-edit' style={{display: 'flex', gap: '10px'}}>
                            <button type="submit" className={`inventario-edit-btn ${isLoading ? 'inventario-edit-btn--disabled' : ''}`} disabled={isLoading}>
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button 
                                type="button" 
                                className='inventario-cancel-btn' 
                                onClick={cancelarEdicion}
                            >
                                Cancelar
                            </button>
                            </div>
                        </form>
                    </>
                )}
                
            </section>

            {/* Tabla de Productos */}
            <div className="inventario-productos-header">
                <h3 className='inventario-productos-header-title'>Tabla de Productos</h3>
                <input className='inventario-productos-header-input' type="text" placeholder='Ingrese el nombre del producto...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {productos.length === 0 ? (
                <div className="no-data-card-info">
                    <p>No tienes productos aún.</p>
                </div>
            ) : (
                <div className='inventario-products-container'>
                    {productosFiltrados.map((prod) => (
                        <div key={prod.id} className='inventario-products-card'>

                            <div className="inventario-product-controls-edit">
                                <button
                                onClick={() => editarProducto(prod)}
                                className='inventario-products-card-control-header'
                                > <img src={pencilIcon} alt="Edit icon" /> </button>

                                <button
                                onClick={() => eliminarProducto(prod.id)}
                                className='inventario-products-card-control-header'
                                > <img src={trashIcon} alt="Delete icon" /> </button>
                            </div>


                            <h3 style={{margin: '25px 0 0', padding: '0'}}>{prod.nombre}</h3>
                            <p><span style={{fontWeight: 'bold'}}>Cantidad:</span> {prod.stock_actual} {prod.unidad}</p>

                            <div className="inventario-products-card-controls">
                                    {/* Botón de Compra */}
                                    <button 
                                        className='inventario-products-card-btn'
                                        onClick={() => manejarMovimiento(prod.id, cantidades[prod.id], 'compra')}
                                        style={{ background: '#4CAF50' }}
                                    > Compra </button>
                                    
                                    {/* Input para cantidad de consumo o compra */}
                                    <input 
                                        className='inventario-products-card-input' 
                                        type="number" 
                                        placeholder="Cantidad"
                                        value={cantidades[prod.id] || ''}
                                        onChange={(e) => setCantidades({...cantidades, [prod.id]: e.target.value})}
                                    />
                                        
                                    {/* Botón de Consumo */}
                                    <button 
                                        className='inventario-products-card-btn'
                                        onClick={() => manejarMovimiento(prod.id, cantidades[prod.id], 'consumo')}
                                        style={{ background: '#f44336' }}
                                    > Consumo </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inventario;