const db = require('../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
    try {
        const {email, password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO usuarios (email, password_hash) VALUES (?, ?)',
            [email, hashedpass]
        );

        res.status(201).json({message: "Usuario creado con éxito"});
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Error al registrar usuario"});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({error: "Credenciales invalidas"});

        const usuario = rows[0];

        const esValida = await bcrypt.compare(password, usuario.password_hash);
        if (!esValida) return res.status(401).json({error: "Credenciales invalidas"});

        const token = jwt.sign(
            {id: usuario.id},
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        );

        res.json({message: "Bienvenido ", token})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error en el login" });
    }
}