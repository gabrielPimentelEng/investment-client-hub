import axios from 'axios';
import { Client } from '@/interfaces/interfaces'; 
import { API_BASE_URL } from '@/constants/constants';

// Fetch all clients
export async function getClients(): Promise<Client[]> {
  const response = await axios.get<Client[]>(`${API_BASE_URL}/clients`);
  return response.data;
}

// Type for creating a new client (without id, createdAt, updatedAt)
export type CreateUpdateClientPayload = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

// Create a new client
export async function createClient(newClientData: CreateUpdateClientPayload): Promise<Client> {
  const response = await axios.post<Client>(`${API_BASE_URL}/clients`, newClientData);
  return response.data;
}

// Get client by id
export async function getClientById(id: number): Promise<Client> {
  const response = await axios.get<Client>(`${API_BASE_URL}/clients/${id}`);
  return response.data;
}

// Update client
export async function updateClient(id: number, updateClientData: CreateUpdateClientPayload): Promise<Client> {
  const response = await axios.patch<Client>(`${API_BASE_URL}/clients/${id}`, updateClientData);
  return response.data;
}