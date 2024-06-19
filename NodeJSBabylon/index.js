import express, { json } from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
const app = express();
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/public', express.static(__dirname + '/public'));

// Middleware de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://playground.babylonjs.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// Serve static files from the project root
app.use(express.static(__dirname));
// View Engine Configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// The endpoint to return the GLB model
app.get('/assets/*', (req, res) => {
    try {
        console.log("peticion de datos")
        const subPath = req.params[0];
        console.log(subPath);
        const fullPath = path.join(process.cwd(),'','assets',subPath);
        res.sendFile(fullPath);
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error:'Error interno del servidor',messageError:error
        });
    }
});
//This edpind returns the index view
app.get('/iniciar', (req, res) => {
    try {
        console.log("peticion =============0")
        res.render('pages/index'); // Renderiza views/index.html
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error interno del servidor',
            messageError: error
        });
    }
});
//When the user accesses the page for the first time, the main view is shown
app.get('/', (req, res) => {
    try {
        console.log("peticion =============0")
        res.render('pages/paginaPrincipal'); // Renderiza views/index.html
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error',
            messageError: error
        });
    }
});
//returns the ejs showing the end of the game
app.get('/gameover', (req, res) => {
    try {
        console.log("peticion =============0")
        res.render('pages/gameOver'); // Renderiza views/index.html
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error',
            messageError: error
        });
    }
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
