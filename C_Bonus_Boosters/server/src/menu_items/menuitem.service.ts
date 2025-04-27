import { pool } from '../db/db.service';
import { MenuItem } from './MenuItem';

export class MenuService {
    static async createMenuItem(data: {
        name: string;
        description?: string;
        price: number;
        category: MenuItem['category'];
        preparation_time: number;
    }) {
        const [result] = await pool.query(
            `INSERT INTO menu_items (name, description, price, category, preparation_time) VALUES (?, ?, ?, ?, ?)`,
            [data.name, data.description ?? null, data.price, data.category, data.preparation_time]
        );
        return result;
    }

    static async getAllMenuItems(): Promise<MenuItem[]> {
        const [rows] = await pool.query(`SELECT * FROM menu_items`);
        return rows as MenuItem[];
    }

    static async getMenuItemById(item_id: number): Promise<MenuItem | null> {
        const [rows] = await pool.query(`SELECT * FROM menu_items WHERE item_id = ?`, [item_id]);
        const items = rows as MenuItem[];
        return items[0] || null;
    }

    static async updateMenuItem(item_id: number, data: Partial<Omit<MenuItem, 'item_id'>>) {
        const fields = [];
        const values = [];
        
        for (const key in data) {
            fields.push(`${key} = ?`);
            values.push((data as any)[key]);
        }

        if (fields.length === 0) return null;

        values.push(item_id);

        const [result] = await pool.query(
            `UPDATE menu_items SET ${fields.join(', ')} WHERE item_id = ?`,
            values
        );
        return result;
    }

    static async deleteMenuItem(item_id: number) {
        const [result] = await pool.query(`DELETE FROM menu_items WHERE item_id = ?`, [item_id]);
        return result;
    }
}