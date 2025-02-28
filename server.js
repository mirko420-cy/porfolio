const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
app.use(cors());

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
    user: 'postgres', // Reemplaza con tu usuario de PostgreSQL
    host: 'localhost',
    database: 'contact_form_db', // Nombre de tu base de datos
    password: 'f3b4g85', // Reemplaza con tu contraseña de PostgreSQL
    port: 5432,
});

// Verificar la conexión a la base de datos
(async () => {
    try {
        await pool.connect();
        console.log('Conectado a la base de datos PostgreSQL');
    } catch (err) {
        console.error('Error al conectar a la base de datos', err);
    }
})();

// Crear el servidor Express
const app = express();
const port = 3000;

// Middleware para procesar datos de formularios en formato JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para manejar la recepción del formulario
app.post('/submit-form', async (req, res) => {
    const { name, L_name, email, message } = req.body;

    try {
        // Insertar los datos en la base de datos
        const result = await pool.query(
            'INSERT INTO contacts (name, last_name, email, message) VALUES ($1, $2, $3, $4)',
            [name, L_name, email, message]
        );

        res.json({ message: 'Mensaje enviado correctamente.' });
    } catch (err) {
        console.error('Error al enviar el mensaje', err);
        if (err.code === '23505') {
            res.status(400).json({ error: 'El correo ya está en uso.' });
        } else {
            res.status(500).json({ error: 'Error al enviar el mensaje.' });
        }
    }
});

// Agregar ruta para la raíz
app.get('/', (req, res) => {
    res.send('<h1>¡Bienvenido a mi servidor!</h1><p>Usa el formulario para enviar un mensaje.</p>');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Cerrar la conexión de la base de datos al finalizar
process.on('exit', () => {
    pool.end();
});
