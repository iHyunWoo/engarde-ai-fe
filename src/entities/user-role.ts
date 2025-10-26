export type UserRole = 'USER' | 'ADMIN' | 'COACH';

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}
