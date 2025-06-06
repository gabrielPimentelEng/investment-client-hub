import axios from 'axios';
import { ClientAsset, Client } from '@/interfaces/interfaces'; 
import { API_BASE_URL } from '@/constants/constants';

// Get all allocations for a specific client
export async function getClientAsset(clientId: number): Promise<Client> {
  const response = await axios.get<Client>(`${API_BASE_URL}/clients/${clientId}/clientAsset`);
  return response.data;
}


// Not using Omit version because we need to send quantity as a number to the api.
export type CreateClientAssetPayload = {
  clientId: number;
  assetId: number;
  quantity: number; // must be number when sending
};

// Create a new allocation for a client
export async function createClientAsset(data: CreateClientAssetPayload): Promise<ClientAsset> {
  const response = await axios.post<ClientAsset>(`${API_BASE_URL}/clients/${data.clientId}/clientAsset`, data);
  return response.data;
}