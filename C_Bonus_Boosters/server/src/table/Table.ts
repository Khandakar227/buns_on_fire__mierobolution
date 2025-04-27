export type TableStatus = 'occupied' | 'available';

export interface Table {
    table_id: number;
    table_number: string;
    capacity: number;
    is_occupied: boolean;
    last_occupied: string | null;
}
