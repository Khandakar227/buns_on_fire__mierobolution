import { pool } from '../db/db.service';
import { Order, OrderWithDetails } from './Order';

export class OrderService {
    async createOrder(order: Order) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // Insert order header
            const [orderResult] = await connection.query(
              `INSERT INTO orders (table_id, user_id, notes) VALUES (?, ?, ?)`,
              [order.table_id, order.user_id || null, order.notes || null]
            );
            const orderId = (orderResult as any).insertId;
            // Insert order items
            for (const item of order.items) {
              await connection.query(
                `INSERT INTO order_items (order_id, item_id, quantity) 
                 VALUES (?, ?, ?)`,
                [orderId, item.item_id, item.quantity]
              );
            }
            const [itemsResult] = await connection.query(  
              `SELECT oi.quantity, mi.name
               FROM order_items oi
               JOIN menu_items mi ON oi.item_id = mi.item_id
               WHERE oi.order_id = ?`,
              [orderId]
            );

            // Calculate total
            const [totalResult] = await connection.query(
              `SELECT SUM(mi.price * oi.quantity) as total_amount
               FROM order_items oi
               JOIN menu_items mi ON oi.item_id = mi.item_id
               WHERE oi.order_id = ?`,
              [orderId]
            );
      
            const totalAmount = (totalResult as any)[0].total_amount;
            // Update order total
            await connection.query(
              `UPDATE orders SET total_amount = ? WHERE order_id = ?`,
              [totalAmount, orderId]
            );
            await connection.commit();
            // Return complete order
            return {
              order_id: orderId,
              table_id: order.table_id,
              user_id: order.user_id,
              items: itemsResult,
              notes: order.notes,
              status: 'pending',
              order_time: new Date(),
              total_amount: totalAmount,
            };
          } catch (error) {
            await connection.rollback();
            throw error;
          } finally {
            connection.release();
          }
        }
        
      
}