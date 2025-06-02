import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/lib/api/clients'; 
import { Client } from '@/interfaces/interfaces'; 

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });
}