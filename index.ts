//import express from 'express';
import express, { Request, Response } from 'express';

import { ConfigController } from './controllers/ConfigController';
import { TCPController } from './controllers/TCPController';
import { ServerConfig } from './models/ServerConfig'
//==import ServerConfig from './ServerConfig';


// Cargar la configuración inicial
const configController = new ConfigController();
const initialConfig = configController.reloadConfig();

// Crear instancia de TCPController con la configuración inicial
const tcpController = new TCPController(initialConfig);

// Iniciar los servidores TCP
tcpController.start();

// Ejemplo de API utilizando Express para gestionar la configuración


const app = express();
app.use(express.json());

// Obtener la configuración actual
app.get('/config', (req: Request, res: Response) => {
    const config = configController.getConfig();
    res.json(config);
});

// Agregar una nueva configuración
app.post('/config', (req: Request, res: Response) => {
    const newServerConfig = req.body as ServerConfig;
    const config = configController.addConfig(newServerConfig);
    res.json(config);
});

// Actualizar una configuración existente
app.put('/config/:serverIndex', (req: Request, res: Response) => {
    const serverIndex = parseInt(req.params.serverIndex);
    const updatedServerConfig = req.body as ServerConfig;
    const config = configController.updateConfig(serverIndex, updatedServerConfig);
    res.json(config);
});

// Eliminar una configuración
app.delete('/config/:serverIndex', (req: Request, res: Response) => {
    const serverIndex = parseInt(req.params.serverIndex);
    const config = configController.deleteConfig(serverIndex);
    res.json(config);
});

// Recargar la configuración desde el archivo
app.post('/config/reload', (req: Request, res: Response) => {
    const config = configController.reloadConfig();
    res.json(config);
});

// Iniciar el servidor de la API
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
});
