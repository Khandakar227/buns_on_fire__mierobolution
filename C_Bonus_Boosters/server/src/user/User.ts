export interface User {
    user_id: number;
    username: string;
    password_hash: string;
    role: UserRole;
    is_active: string;
    last_login: string;
}

export type UserRole = 'server' | 'chef' | 'manager';
