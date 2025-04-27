import express, { Request, Response } from 'express';
import { TableService } from './table.service';

const router = express.Router();

// Create a new table
router.post('/', async (req: Request, res: Response) => {
    try {
        const { table_number, capacity } = req.body;
        const result = await TableService.createTable({ table_number, capacity });
        res.status(201).json({ message: 'Table created successfully', result });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all tables
router.get('/', async (req: Request, res: Response) => {
    try {
        const tables = await TableService.getAllTables();
        res.json(tables);
    } catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get table by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const table_id = Number(req.params.id);
        const table = await TableService.getTableById(table_id);
        if (!table) {
            res.status(404).json({ message: 'Table not found' });
            return;
        }
        res.json(table);
    } catch (error) {
        console.error('Error fetching table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update table
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const table_id = Number(req.params.id);
        const data = req.body;
        const result = await TableService.updateTable(table_id, data);
        res.json({ message: 'Table updated successfully', result });
    } catch (error) {
        console.error('Error updating table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete table
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const table_id = Number(req.params.id);
        const result = await TableService.deleteTable(table_id);
        res.json({ message: 'Table deleted successfully', result });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
