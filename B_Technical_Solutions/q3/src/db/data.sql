INSERT INTO tables (table_id, table_number, capacity, is_occupied, last_occupied) VALUES
(1, 'T1', 4, FALSE, NULL),
(2, 'T2', 2, TRUE, '2023-05-15 12:30:00'),
(3, 'T3', 6, FALSE, '2023-05-14 20:15:00'),
(4, 'T4', 4, TRUE, '2023-05-15 13:45:00'),
(5, 'T5', 8, FALSE, '2023-05-13 21:30:00'),
(6, 'T6', 2, FALSE, NULL),
(7, 'T7', 4, TRUE, '2023-05-15 12:15:00'),
(8, 'T8', 6, FALSE, '2023-05-14 19:45:00');

INSERT INTO menu_items (name, description, price, category, preparation_time, is_available) VALUES
('Bruschetta', 'Toasted bread topped with tomatoes, garlic, and fresh basil', 8.99, 'appetizer', 10, TRUE),
('Caesar Salad', 'Romaine lettuce with Caesar dressing, croutons, and parmesan', 9.99, 'appetizer', 8, TRUE),
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 14.99, 'main', 15, TRUE),
('Spaghetti Carbonara', 'Pasta with creamy egg sauce, pancetta, and parmesan', 16.99, 'main', 12, TRUE),
('Grilled Salmon', 'Fresh salmon fillet with lemon butter sauce', 22.99, 'main', 18, TRUE),
('Tiramisu', 'Coffee-flavored Italian dessert with mascarpone', 7.99, 'dessert', 5, TRUE),
('Chocolate Lava Cake', 'Warm chocolate cake with a molten center', 8.99, 'dessert', 10, TRUE),
('Iced Tea', 'Freshly brewed iced tea with lemon', 3.99, 'beverage', 2, TRUE),
('Craft Beer', 'Local craft beer selection', 6.99, 'beverage', 1, TRUE),
('House Red Wine', 'Glass of our signature red blend', 8.99, 'beverage', 1, FALSE);
