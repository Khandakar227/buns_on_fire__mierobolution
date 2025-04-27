import { pool } from '../db/db.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from './jwt.service';
import { NextFunction, Request, Response } from "express";

export class UserService {
    constructor() {}

    static async createUser(data: { username: string; password: string; }) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const [rows] = await pool.query(
                `INSERT INTO users (username, password_hash, role, is_active, last_login)
                 VALUES (?, ?, 'user', '1', NOW())`,
                [data.username, hashedPassword]
            );

            return { message: 'User created successfully' };
        } catch (error: any) {
            console.error('Error creating user:', error);
            if (error.code === 'ER_DUP_ENTRY') throw new Error('User already exists');
            throw new Error(error.message);
        }
    }

    static async validateUser(email: string, password: string) {
        const [rows]: any = await pool.query(
            `SELECT * FROM users WHERE email = ? LIMIT 1`,
            [email]
        );

        const user = rows[0];

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Exclude password hash
        const { password_hash, ...result } = user;
        return result;
    }

    static async login(user: any) {
        const payload = { 
            user_id: user.user_id, 
            username: user.username,
            sub: user.user_id, 
            role: user.role 
        };

        return {
            access_token: await JwtService.signToken(payload, process.env.JWT_SECRET as string, 3600 * 24),
        };
    }

    static async findById(id: string) {
        const [rows]: any = await pool.query(
            `SELECT * FROM users WHERE user_id = ? LIMIT 1`,
            [id]
        );

        const user = rows[0];
        if (!user) {
            throw new Error('User not found');
        }

        const { password_hash, ...result } = user;
        return result;
    }

     // Manager only     
      static async getAllUsers() {
        const [rows]: any = await pool.query(
            `SELECT user_id, username, role, is_active, last_login FROM users`
        );
        return rows;
    }

     // Manager only     
    static async updateUser(user_id: string, data: { username?: string; password?: string; role?: string; is_active?: boolean; }) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.username) {
            fields.push('username = ?');
            values.push(data.username);
        }
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            fields.push('password_hash = ?');
            values.push(hashedPassword);
        }
        if (data.role) {
            fields.push('role = ?');
            values.push(data.role);
        }
        if (typeof data.is_active != 'undefined') {
            fields.push('is_active = ?');
            values.push(data.is_active);
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        values.push(user_id);

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
        const [result]: any = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }

        return { message: 'User updated successfully' };
    }

    // Manager only     
    static async deleteUser(user_id: string) {
        const [result]: any = await pool.query(
            `DELETE from users WHERE user_id = ?`,
            [user_id]
        );

        if (result.affectedRows === 0) {
            throw new Error('User not found or already deleted');
        }

        return { message: 'User deactivated successfully' };
    }
}

