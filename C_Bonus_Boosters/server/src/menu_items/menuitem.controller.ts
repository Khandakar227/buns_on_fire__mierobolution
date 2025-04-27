import express, { Request, Response } from 'express';
import { MenuService } from './menuitem.service';

const router = express.Router();

// Create a new menu item
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description, price, category, preparation_time } = req.body;
        const result = await MenuService.createMenuItem({ name, description, price, category, preparation_time });
        res.status(201).json({ message: 'Menu item created successfully', result });
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all menu items
router.get('/', async (req: Request, res: Response) => {
    try {
        const items = await MenuService.getAllMenuItems();
        res.json(items);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get menu item by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const item_id = Number(req.params.id);
        const item = await MenuService.getMenuItemById(item_id);
        if (!item) {
            res.status(404).json({ message: 'Menu item not found' });
            return;
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update menu item
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const item_id = Number(req.params.id);
        const data = req.body;
        const result = await MenuService.updateMenuItem(item_id, data);
        res.json({ message: 'Menu item updated successfully', result });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete menu item
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const item_id = Number(req.params.id);
        const result = await MenuService.deleteMenuItem(item_id);
        res.json({ message: 'Menu item deleted successfully', result });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;