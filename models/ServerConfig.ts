export class ServerConfig {
    serverIndex: number;
    port: number;
    destinationIP: string;
    destinationPort: number;
    alternateDestinationIP: string;
    alternateDestinationPort: number;

    constructor(
        serverIndex: number,
        port: number,
        destinationIP: string,
        destinationPort: number,
        alternateDestinationIP: string,
        alternateDestinationPort: number
    ) {
        this.serverIndex = serverIndex;
        this.port = port;
        this.destinationIP = destinationIP;
        this.destinationPort = destinationPort;
        this.alternateDestinationIP = alternateDestinationIP;
        this.alternateDestinationPort = alternateDestinationPort;
    }
}



/*   Este código define la clase ServerConfig que representa la configuración de un servidor. La clase tiene propiedades para serverIndex, port, destinationIP, destinationPort, alternateDestinationIP y alternateDestinationPort.

  El constructor de la clase acepta los valores para todas estas propiedades y los asigna a las propiedades correspondientes en la instancia de ServerConfig. */