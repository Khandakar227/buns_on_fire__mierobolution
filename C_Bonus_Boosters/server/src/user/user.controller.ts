import { Router, Request, Response } from 'express';
import {UserService} from './user.service'
import { AuthService } from '../auth/authService';

const router = Router();

router.post('/signup', AuthService.authorizeManager, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserService.createUser({ username, password });
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserService.validateUser(username, password);
        const token = await UserService.login(user);
        res.status(200).json(token);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/:id', AuthService.authorizeManager, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put('/:id', AuthService.authorizeManager, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.updateUser(id, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:id', AuthService.authorizeManager, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserService.deleteUser(id);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/all', AuthService.authorizeManager, async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;