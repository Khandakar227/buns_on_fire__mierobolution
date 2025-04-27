import { Router } from 'express';
import { OrderService } from './order.service';
import { Order } from './Order';
import { AuthService } from '../auth/authService';
import { WsSocketService } from '../ws/wsService';

const router = Router();

router.post('/', AuthService.authorize, async (req, res) => {
    const orderService = new OrderService();
    const order: Order = req.body;
    try {
        const createdOrder = await orderService.createOrder(order);
        WsSocketService.broadcast({
            eventName: 'kitchen display',
            ...createdOrder,
        });

        console.log('Order created:', createdOrder);

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

export default router;
