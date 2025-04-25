CREATE TABLE tables (
    table_id INT PRIMARY KEY,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INT NOT NULL,
    is_occupied BOOLEAN DEFAULT FALSE,
    last_occupied TIMESTAMP,
    INDEX (table_number)
);

-- Users table (staff and managers)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('server', 'chef', 'manager') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    
    INDEX (username)
);

CREATE TABLE menu_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('appetizer', 'main', 'dessert', 'beverage') NOT NULL,
    preparation_time INT COMMENT 'Estimated prep time in minutes',
    is_available BOOLEAN DEFAULT TRUE,

    INDEX (name),
    INDEX (category),
    INDEX (is_available)
);

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_id INT NOT NULL,
    user_id INT COMMENT 'Server assigned to table',
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'preparing', 'ready', 'delivered', 'paid') DEFAULT 'pending',
    total_amount DECIMAL(12,2),
    notes TEXT,
    
    FOREIGN KEY (table_id) REFERENCES tables(table_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    
    INDEX (order_time),
    INDEX (status),
    INDEX (table_id, status)
);

CREATE TABLE order_items (
    order_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    item_status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id),

    INDEX (order_id),
    INDEX (item_status)
);

CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'credit', 'debit', 'mobile') NOT NULL,
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tip_amount DECIMAL(10,2),
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id),

    INDEX (payment_time),
    INDEX (order_id)
);
