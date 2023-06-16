import fs from 'fs';
import path from 'path';

interface ServerConfig {
    serverIndex: number;
    port: number;
    destinationIP: string;
    destinationPort: number;
    alternateDestinationIP: string;
    alternateDestinationPort: number;
}

export class ConfigController {
    private configFilePath: string;

    constructor() {
        this.configFilePath = path.resolve(__dirname, '../config.txt');
    }

    private parseConfig(configData: string): ServerConfig[] {
        const servers: ServerConfig[] = [];

        const lines = configData.split('\n');
        console.log(lines);
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, value] = trimmedLine.split('=');
                if (key && value) {
                    const [serverIndexStr, property] = key.split('_');
                    const serverIndex = parseInt(serverIndexStr);
                    let server = servers.find((s) => s.serverIndex === serverIndex);
                    if (!server) {
                        server = {
                            serverIndex,
                            port: 0,
                            destinationIP: '',
                            destinationPort: 0,
                            alternateDestinationIP: '',
                            alternateDestinationPort: 0,
                        };
                        servers.push(server);
                    }

                    switch (property) {
                        case 'PORT':
                            server.port = parseInt(value);
                            break;
                        case 'DESTINATION_IP':
                            server.destinationIP = value;
                            break;
                        case 'DESTINATION_PORT':
                            server.destinationPort = parseInt(value);
                            break;
                        case 'ALTERNATE_DESTINATION_IP':
                            server.alternateDestinationIP = value;
                            break;
                        case 'ALTERNATE_DESTINATION_PORT':
                            server.alternateDestinationPort = parseInt(value);
                            break;
                    }
                }
            }
        }

        return servers;
    }

    private saveConfig(config: ServerConfig[]): void {
        const lines: string[] = [];

        for (const server of config) {
            lines.push(`SERVER_${server.serverIndex}_PORT=${server.port}`);
            lines.push(`SERVER_${server.serverIndex}_DESTINATION_IP=${server.destinationIP}`);
            lines.push(`SERVER_${server.serverIndex}_DESTINATION_PORT=${server.destinationPort}`);
            lines.push(`SERVER_${server.serverIndex}_ALTERNATE_DESTINATION_IP=${server.alternateDestinationIP}`);
            lines.push(`SERVER_${server.serverIndex}_ALTERNATE_DESTINATION_PORT=${server.alternateDestinationPort}`);
            lines.push(''); // Empty line between server configurations
        }

        const configData = lines.join('\n');

        fs.writeFileSync(this.configFilePath, configData);
    }

    public getConfig(): ServerConfig[] {
        const configData = fs.readFileSync(this.configFilePath, 'utf8');
        const config = this.parseConfig(configData);
        return config;
    }

    private getServerConfig(serverIndex: number): ServerConfig | undefined {
        const config = this.getConfig();
        const server = config.find((s) => s.serverIndex === serverIndex);
        return server;
    }

    public addConfig(server: ServerConfig): ServerConfig[] {
        const config = this.getConfig();
        config.push(server);
        this.saveConfig(config);
        return config;
    }

    public updateConfig(serverIndex: number, updatedServer: ServerConfig): ServerConfig[] {
        const config = this.getConfig();
        const index = config.findIndex((s) => s.serverIndex === serverIndex);
        if (index !== -1) {
            config[index] = updatedServer;
            this.saveConfig(config);
        }
        return config;
    }

    public deleteConfig(serverIndex: number): ServerConfig[] {
        const config = this.getConfig();
        const index = config.findIndex((s) => s.serverIndex === serverIndex);
        if (index !== -1) {
            config.splice(index, 1);
            this.saveConfig(config);
        }
        return config;
    }

    public reloadConfig(): ServerConfig[] {
        const config = this.getConfig();
        return config;
    }
}




/* Este código define la clase ConfigController que encapsula la lógica para manipular la configuración de los servidores. 
Incluye métodos como addConfig, updateConfig, deleteConfig y reloadConfig para agregar, actualizar, eliminar y recargar 
la configuración respectivamente.

Además, incluye métodos privados como parseConfig para analizar los datos de configuración, saveConfig para guardar la 
configuración en el archivo, getConfig para obtener la configuración actual y getServerConfig para obtener la 
configuración de un servidor específico. */