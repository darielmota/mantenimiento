// Importar los módulos necesarios
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Crear la aplicación Express
const app = express();

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Reemplaza con tu usuario de MySQL
    password: '12345678', // Reemplaza con tu contraseña de MySQL
    database: 'mantenimiento'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

// Middleware para habilitar CORS y manejar JSON
app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json()); // Para manejar solicitudes con datos JSON

// Rutas CRUD

// Obtener todos los elementos
app.get('/api/items', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) {
            console.error('Error al obtener los items:', err);
            return res.status(500).send('Error al obtener los items');
        }
        res.json(results);
    });
});

// Obtener un elemento por ID
app.get('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el item:', err);
            return res.status(500).send('Error al obtener el item');
        }
        if (results.length === 0) {
            return res.status(404).send('El item no fue encontrado');
        }
        res.json(results[0]);
    });
});

// Crear un nuevo elemento
app.post('/api/items', (req, res) => {
    const { nombre, descripcion } = req.body;
    db.query('INSERT INTO items (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion], (err, result) => {
        if (err) {
            console.error('Error al agregar el item:', err);
            return res.status(500).send('Error al agregar el item');
        }
        const newItem = { id: result.insertId, nombre, descripcion };
        res.status(201).json(newItem);
    });
});

// Actualizar un elemento
app.put('/api/items/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;
    db.query('UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?', [nombre, descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el item:', err);
            return res.status(500).send('Error al actualizar el item');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('El item no fue encontrado');
        }
        res.json({ id, nombre, descripcion });
    });
});

// Eliminar un elemento
app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM items WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el item:', err);
            return res.status(500).send('Error al eliminar el item');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('El item no fue encontrado');
        }
        res.status(204).send();
    });
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
