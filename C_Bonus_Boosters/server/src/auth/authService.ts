import { NextFunction, Request, Response } from "express";
import { JwtService } from "../user/jwt.service";

export class AuthService {
    static authorize = async (req: Request, res: Response, next: NextFunction) => {
        try {
        // Token based authentication for esp32 requests
        next();   
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(401).json({ error: "Unauthorized" });
        }
    }

    /* Middlewares */
    static authorizeManager = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const payload = await JwtService.verifyToken(token, process.env.JWT_SECRET as string);
            if (payload.role !== 'manager') {
                res.status(403).json({ message: 'Forbidden' });
                return;
            }
            res.locals.user = payload;
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(401).json({ error: "Unauthorized" });
        }
    }

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
    
}