import { useQuery } from '@tanstack/react-query';
import { getClientById } from '@/lib/api/clients';
import { Client } from '@/interfaces/interfaces';

export function useClientById(clientId: number) {
    return useQuery<Client>({
        queryKey: ['client', clientId],
        queryFn: () => getClientById(clientId),
        enabled: !!clientId, // Only run the query if clientId is truthy
    })
}