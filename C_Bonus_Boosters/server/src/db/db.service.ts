import { Pool } from 'mysql2/promise';
import { createPool } from 'mysql2/promise';
import { initSQLCode } from './init.sql';
import dotenv from 'dotenv';

dotenv.config();

const databaseName = process.env.MYSQL_DATABASE || 'mydatabase';
const databaseUser = process.env.MYSQL_USER || 'root';
const databasePassword = process.env.MYSQL_PASSWORD || 'password';
const databaseHost = process.env.MYSQL_HOST || 'localhost';


export const pool = createPool({
    database: databaseName,
    user: databaseUser,
    password: databasePassword,
    host: databaseHost,
    waitForConnections: true,
    connectionLimit: 20,
});

export class DatabaseService {
    private static instance: DatabaseService;
    private pool: Pool;

    private constructor() {
        this.pool = pool;
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public getPool() {
        return this.pool;
    }

    public async init() {
        try {
            const statements = initSQLCode
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0);

            const conn = await this.pool.getConnection();
            try {
                for (const statement of statements) {
                    await conn.query(statement);
                }
            } finally {
                conn.release();
            }
        } catch (err) {
            console.error('Error during database initialization:', err);
        }
    }
}

