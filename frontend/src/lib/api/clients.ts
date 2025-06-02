import axios from 'axios';
import { Client } from '@/interfaces/interfaces'; 
import { API_BASE_URL } from '@/constants/constants';

// Fetch all clients
export async function getClients(): Promise<Client[]> {
  const response = await axios.get<Client[]>(`${API_BASE_URL}/clients`);
  return response.data;
}

// Type for creating a new client (without id, createdAt, updatedAt)
export type CreateClientPayload = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

// Create a new client
export async function createClient(newClientData: CreateClientPayload): Promise<Client> {
  const response = await axios.post<Client>(`${API_BASE_URL}/clients`, newClientData);
  return response.data;
}