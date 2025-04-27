export interface OrderItem {
    item_id: number;
    quantity: number;
  }
  
  export interface Order {
    table_id: number;
    user_id?: number;
    items: OrderItem[];
    notes?: string;
  }
  
  export interface OrderWithDetails extends Order {
    order_id: number;
    status: string;
    order_time: Date;
    total_amount: number;
  }