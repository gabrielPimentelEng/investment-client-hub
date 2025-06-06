'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientAsset, CreateClientAssetPayload} from '@/lib/api/clientAsset';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { ClientAsset } from '@/interfaces/interfaces';

interface AddClientFormProps {
  onSuccess?: () => void;
  data: CreateClientAssetPayload; 
}

export function useCreateClientAsset(options: AddClientFormProps){
    const queryClient = useQueryClient();

    return useMutation<ClientAsset, AxiosError | Error, CreateClientAssetPayload >({
        mutationFn: createClientAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientAsset', options.data.clientId] });
            queryClient.invalidateQueries({ queryKey: ['clients', options.data.clientId] });
            options?.onSuccess?.();
            toast.success("Sucesso",{
                description: 'Ação alocada ao cliente.',
                action: {
                label: "Fechar",
                onClick: () => {
                    toast.dismiss();
                },
            },
        });   
        },
       onError: (error: AxiosError | Error) => { 
        let errorMessage = 'Erro ao alocar ativo ao cliente.';
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 400 && error.response.data?.errors) {
                errorMessage = error.response.data.errors.map((err: { message: string }) => err.message).join(', ');
            }  else {
                errorMessage = error.response.data.message || errorMessage;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message; // Catch generic JS errors too
        }
        toast.error("Erro",{
            description: errorMessage,
        });
    },
    });
}