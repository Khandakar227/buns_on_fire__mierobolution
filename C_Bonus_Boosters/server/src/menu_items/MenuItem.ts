export type MenuCategory = 'appetizer' | 'main' | 'dessert' | 'beverage';

export interface MenuItem {
    item_id: number;
    name: string;
    description: string | null;
    price: number;
    category: MenuCategory;
    preparation_time: number;
    is_available: boolean;
}