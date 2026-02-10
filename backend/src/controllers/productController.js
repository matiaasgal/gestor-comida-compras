const db = require('../config/db');

exports.crearProducto = async (req, res) => {
    const { nombre, unidad, stock_inicial } = req.body;
    const usuario_id = req.user.id;

    try {
        const stockNumerico = parseFloat(stock_inicial);
        const unidadDefault = (unidad === '' || unidad === 'none') ? 'unidades' : unidad;
        const [result] = await db.query(
            'INSERT INTO productos (usuario_id, nombre, stock_actual, unidad) VALUES (?, ?, ?, ?)',
            [usuario_id, nombre, stockNumerico || 0, unidadDefault]
        );
        res.status(201).json({ message: "Producto creado en tu despensa" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear producto" });
    }
};

exports.eliminarProducto = async (req, res) => {
    const { producto_id } = req.body;
    const usuario_id = req.user.id;

    try {
        await db.query('DELETE FROM compras WHERE producto_id = ? AND usuario_id = ?', [producto_id, usuario_id]);
        const [result] = await db.query('DELETE FROM productos WHERE id = ? AND usuario_id = ?', [producto_id, usuario_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado o no tienes permiso" });
        }

        res.status(200).json({ message: "Producto eliminado de tu despensa" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
};

exports.editarProducto = async (req, res) => {
    const { id, nombre, stock_actual, unidad } = req.body;
    const usuario_id = req.user.id;

    if (!id || !nombre || stock_actual === undefined) {
        return res.status(400).json({ message: "Faltan datos necesarios" });
    }

    try {
        const stockNumerico = parseFloat(stock_actual);
        const [result] = await db.query('UPDATE productos SET nombre = ?, stock_actual = ?, unidad = ? WHERE id = ? AND usuario_id = ?', [nombre, stockNumerico, unidad, id, usuario_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Producto no encontrado o no tienes permiso" });
        }

        res.status(200).json({ message: "Producto eliminado de tu despensa" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al eliminar producto" });
    }
};

exports.registrarCompra = async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.user.id;

    try {
        await db.query(
            'INSERT INTO compras (producto_id, usuario_id, cantidad) VALUES (?, ?, ?)',
            [producto_id, usuario_id, cantidad]
        );

        await db.query(
            'UPDATE productos SET stock_actual = stock_actual + ? WHERE id = ? AND usuario_id = ?',
            [cantidad, producto_id, usuario_id]
        );
        res.json({ message: "Compra registrada." });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro" });
    }
};

exports.registrarConsumo = async (req, res) => {
    const { producto_id, cantidad } = req.body;
    const usuario_id = req.user.id;

    try {
        const [producto] = await db.query(
            'SELECT stock_actual FROM productos WHERE id = ? AND usuario_id = ?',
            [producto_id, usuario_id]
        );

        const stockActual = producto[0].stock_actual;

        if (stockActual <= 0) {
            return res.status(400).json({ message: "No puedes consumir un producto con stock 0." });
        }

        if (stockActual <= 0) {
            return res.status(400).json({ message: "No puedes consumir un producto con stock 0." });
        }

        await db.query(
            'INSERT INTO consumos (producto_id, usuario_id, cantidad_gastada) VALUES (?, ?, ?)',
            [producto_id, usuario_id, cantidad]
        );
        res.json({ message: "Consumo registrado." });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro" });
    }
};

exports.obtenerInventario = async (req, res) => {
    const usuario_id = req.user.id;

    try {
        const [productos] = await db.query(
            'SELECT * FROM productos WHERE usuario_id = ?',
            [usuario_id]
        );
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el inventario" });
    }
};

exports.obtenerCompras = async (req, res) => {
    const usuario_id = req.user.id;

    try {
        const [compras] = await db.query(
            'SELECT compras.id, compras.cantidad, compras.fecha_compra, productos.nombre FROM compras INNER JOIN productos ON compras.producto_id = productos.id WHERE compras.usuario_id = ?',
            [usuario_id]
        );

        //console.log(compras);
        res.json(compras);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las compras "});
    }
};

exports.obtenerConsumos = async (req, res) => {
    const usuario_id = req.user.id;

    try {
        const [consumos] = await db.query(
            'SELECT consumos.id, consumos.cantidad_gastada, consumos.fecha_consumo, productos.nombre FROM consumos INNER JOIN productos ON consumos.producto_id = productos.id WHERE consumos.usuario_id = ?',
            [usuario_id]
        );
        //console.log(consumos);
        res.json(consumos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las compras "});
    }
};
