const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 1. Inicializamos 'app' PRIMERO
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 2. Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '1234', // ⚠️ Vuelve a poner tu contraseña aquí
    database: 'PhazeerDB'
});

// 3. Probar la conexión
db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ ¡Conexión exitosa a la base de datos PhazeerDB!');
});

// 4. Ruta base de prueba
app.get('/', (req, res) => {
    res.send('🏥 Servidor Backend de Phazeer HC funcionando correctamente.');
});

// 5. Nuestra "Compuerta" para enviar el inventario a React
app.get('/api/inventario', (req, res) => {
    db.query('SELECT * FROM Vista_Inventario_Actual', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error obteniendo inventario' });
        }
        res.json(results);
    });
});

// 6. Encender el servidor en el puerto 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});