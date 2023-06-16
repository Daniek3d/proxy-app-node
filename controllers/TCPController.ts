import net from 'net';

interface ServerConfig {
    serverIndex: number;
    port: number;
    destinationIP: string;
    destinationPort: number;
    alternateDestinationIP: string;
    alternateDestinationPort: number;
}

export class TCPController {

    private servers: ServerConfig[];

    constructor(servers: ServerConfig[]) {
        this.servers = servers;
    }

    public start(): void {
        for (const server of this.servers) {
            this.createServer(server);
        }
    }

    private createServer(server: ServerConfig): void {
        const tcpServer = net.createServer((socket) => {
            console.log(`Connection established on port ${server.port}`);

            const destination = {
                ip: server.destinationIP,
                port: server.destinationPort,
            };

            let alternateDestination = {
                ip: server.alternateDestinationIP,
                port: server.alternateDestinationPort,
            };

            socket.on('data', (data) => {
                const destinationServer = this.isDestinationOnline(destination.ip, destination.port)
                    ? destination
                    : alternateDestination;

                const destinationSocket = net.createConnection(destinationServer.port, destinationServer.ip, () => {
                    console.log(`Forwarding data to ${destinationServer.ip}:${destinationServer.port}`);
                    destinationSocket.write(data);
                });

                destinationSocket.on('error', (error) => {
                    console.error(`Error connecting to ${destinationServer.ip}:${destinationServer.port}`);
                    console.error(error);
                });

                destinationSocket.on('close', () => {
                    console.log(`Connection closed with ${destinationServer.ip}:${destinationServer.port}`);
                });

                socket.pipe(destinationSocket);
                destinationSocket.pipe(socket);
            });

            socket.on('error', (error) => {
                console.error(`Error on connection to port ${server.port}`);
                console.error(error);
            });

            socket.on('close', () => {
                console.log(`Connection closed on port ${server.port}`);
            });
        });

        tcpServer.listen(server.port, () => {
            console.log(`TCP server listening on port ${server.port}`);
        });
    }

    private isDestinationOnline(ip: string, port: number): boolean {
        // Logic to check if the destination server is online
        // For example, you can try to establish a connection to the destination server and check for a successful connection
        return true;
    }
}




/* Este código define la clase TCPController que se encarga de crear y gestionar los servidores TCP según la configuración proporcionada.

La función start recorre la lista de servidores y crea un servidor TCP para cada uno utilizando la función createServer.

La función createServer crea un servidor TCP utilizando el módulo net de Node.js. Se establece una conexión con el cliente y se manejan los eventos de data, error y close.

Dentro del evento data, se determina el destino al que se enviará la información (ya sea el destino principal o el destino alternativo) y se crea una conexión con ese destino utilizando la función net.createConnection. Se manejan los eventos de error y close de la conexión y se establece el flujo de datos bidireccional entre el cliente y el destino utilizando los métodos pipe.

La función isDestinationOnline es un ejemplo de cómo se puede implementar la lógica para verificar si el destino está en línea. En este caso, se asume que el destino está siempre en línea y devuelve true, pero puedes personalizar esta función para realizar la verificación real. */