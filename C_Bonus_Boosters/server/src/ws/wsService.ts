import { WebSocket, WebSocketServer } from 'ws';
import { Express } from 'express';
import { Server } from 'http';

type EventName = 'kitchen display' | 'table' | string;
interface Client {
    ws: WebSocket;
}
  
export class WsSocketService {
    private static wss: WebSocketServer;
    // private clients: Set<Client> = new Set();

    constructor(server: Server) {
        // WebSocket server
        WsSocketService.wss = new WebSocketServer({ server });

        WsSocketService.wss.on('connection', (ws) => {
            
            console.log('Client connected');
            console.log('clients count: ', WsSocketService.wss.clients.size);
            
            ws.send("Welcome from server!");
            
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    public static broadcast(data: any) {
        WsSocketService.wss.clients.forEach((client) => {
            if (client.readyState !== WebSocket.OPEN) return;
            // const message = WsSocketService.formatMessage(event, data);
            client.send(JSON.stringify(data));
            // console.log('\n\nmessage: ', message);
            console.log('data: ', data);
            // console.log('event: ', event);
        });
    }

    private static formatMessage(event: string, data: Record<string, string | number>): string {
        const entries = Object.entries(data)
          .map(([key, val]) => `${key}=${val.toString().replace(/,/g, '+')}`) // Commas → + to avoid parsing issues
          .join(',');
        return `${event}|${entries}`;
    }
}
