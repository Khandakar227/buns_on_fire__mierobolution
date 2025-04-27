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

    /* Middlewares */
    static async checkUser(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            res.locals.user = payload;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Unauthorized' });
        }
    }

    static async checkAdmin(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            if (payload.role !== 'admin') {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            res.locals.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }

    static async checkManager(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        try {
            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            if (payload.role !== 'manager' && payload.user_id !== parseInt(req.params.id)) {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            res.locals.user = payload;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
}
