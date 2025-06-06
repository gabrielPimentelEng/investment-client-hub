'use client';

import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAssets } from '@/lib/api/assets'; 
import { Asset } from '@/interfaces/interfaces';

export function useAssets() {
  return useQuery<Asset[], AxiosError | Error>({
    queryKey: ['assets'], 
    queryFn: getAssets,   
  });
}