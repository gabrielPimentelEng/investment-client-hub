export interface Client {
  id: number;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string; 
  updatedAt: string; 
}
