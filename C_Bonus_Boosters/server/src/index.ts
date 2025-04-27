import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import OrderRouter from './order/order.controller';
import TableRouter from './table/table.controller';
import MenuItemController from './menu_items/menuitem.controller';
import { WsSocketService } from './ws/wsService';
import { DatabaseService } from './db/db.service';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(express.json());
const server = http.createServer(app);

const wsSocket = new WsSocketService(server);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Bistro92 by Buns on Fire!');
});

app.use('/api/v1/order', OrderRouter);
app.use('/api/v1/table', TableRouter);
app.use('/api/v1/menu_items', MenuItemController);

server.listen(port, () => {
    console.log(`Server is running on < http://localhost:${port} >`);
    DatabaseService.getInstance().init()
        .then(() => console.log('Database initialized successfully.'))
        .catch((err) => console.error('Error during database initialization:', err));
  });
