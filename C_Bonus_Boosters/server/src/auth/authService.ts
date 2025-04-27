import { NextFunction, Request, Response } from "express";

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

    static authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
        // Token based authentication for esp32 requests
        next();   
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(401).json({ error: "Unauthorized" });
        }
    }
}