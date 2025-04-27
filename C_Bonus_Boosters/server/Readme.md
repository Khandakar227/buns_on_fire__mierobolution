## API Routes

### 📌 Authentication
| Method |    Endpoint    | Description                             |
|--------|----------------|-----------------------------------------|
| POST   | `api/v1/user/signup` | Create a new user (server/chef/manager) |
| POST   | `api/v1/user/auth/login`    | Login and receive JWT access token      |


###  📌 Users (Staf Manager)
|Method | Endpoint | Description |
|-------|----------|-------------|
|GET | `/user/:id` | Get user details |
|POST | `/user/` | Create a new user (manager only) |
|PUT | `/user/:id` | Update user information |
|DELETE | `/users/:id` | Deactivate (soft delete) a user |

Use `role` field to identify permissions: `'server'`, `'chef'`, `'manager'`.


### 📌 Restaurant Tables
| Method | Endpoint | Description      |
|--------|--------|--------|
| GET | `/table/` | List all tables    |
| POST | `/table/` | Add a new table   |
| PUT | `/table/:id` | Update Table    |
| DELETE | `/table/:id` | Delete Table |
<!--
| PUT | `/table/:id/occupy` | Mark table as occupied
| PUT | `/table/:id/vacate` | Mark table as vacated
| DELETE | `/table/:id` | Remove a table
-->

### 📌 Menu Items
| Method | Endpoint | Description |
|--------|--------|---------|
GET | `/menu-items/` | List all available menu items |
POST | `/menu-items/` | Add a new menu item (manager only) |
PUT | `/menu-items/:id` | Update a menu item |
DELETE | `/menu-items/:id` | Remove a menu item |