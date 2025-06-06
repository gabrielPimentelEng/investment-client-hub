'use client';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getClientAsset } from '@/lib/api/clientAsset';
import { Client } from '@/interfaces/interfaces';

// Hook to fetch allocations for a specific client
export function useClientAsset(clientId: number) {
  return useQuery<Client, AxiosError | Error>({
    queryKey: ['clientAsset', clientId],
    queryFn: () => getClientAsset(clientId),
    enabled: !!clientId,
  });
}