
export interface AuthResponse {
  _id?: string;
  userName: string;
  phone: string;
  role?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}
