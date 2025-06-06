import axios from 'axios';
import { Asset } from '@/interfaces/interfaces'; 
import { API_BASE_URL } from '@/constants/constants';

export async function getAssets(): Promise<Asset[]> {
  const response = await axios.get<Asset[]>(`${API_BASE_URL}/assets`);
  return response.data;
}