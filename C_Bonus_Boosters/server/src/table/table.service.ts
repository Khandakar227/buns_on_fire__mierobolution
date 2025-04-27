import { pool } from '../db/db.service';
import { Table } from './Table';

export class TableService {
    static async createTable(data: { table_number: string; capacity: number }) {
        const [result] = await pool.query(
            `INSERT INTO tables (table_number, capacity) VALUES (?, ?)`,
            [data.table_number, data.capacity]
        );
        return result;
    }

    static async getAllTables(): Promise<Table[]> {
        const [rows] = await pool.query(`SELECT * FROM tables`);
        return rows as Table[];
    }

    static async getTableById(table_id: number): Promise<Table | null> {
        const [rows] = await pool.query(`SELECT * FROM tables WHERE table_id = ?`, [table_id]);
        const tables = rows as Table[];
        return tables[0] || null;
    }

    static async updateTable(table_id: number, data: Partial<{ table_number: string; capacity: number; is_occupied: boolean }>) {
        const fields = [];
        const values = [];
        
        for (const key in data) {
            fields.push(`${key} = ?`);
            values.push((data as any)[key]);
        }

        if (fields.length === 0) return null;

        values.push(table_id);

        const [result] = await pool.query(
            `UPDATE tables SET ${fields.join(', ')} WHERE table_id = ?`,
            values
        );
        return result;
    }

    static async deleteTable(table_id: number) {
        const [result] = await pool.query(`DELETE FROM tables WHERE table_id = ?`, [table_id]);
        return result;
    }
}
