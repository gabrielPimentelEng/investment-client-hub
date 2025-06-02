import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Client } from '@/interfaces/interfaces';
import { createClient,  CreateClientPayload } from '@/lib/api/clients';

interface AddClientFormProps {
  onSuccess?: () => void;
}

export function useCreateClient(options?: AddClientFormProps) {
  const queryClient = useQueryClient();
  return useMutation<Client, AxiosError | Error, CreateClientPayload>({
    mutationFn: createClient,
    
    onSuccess: () => {
      //invalidate clients query to refetch data 
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      options?.onSuccess?.();
      toast.success("Cliente criado.",{
        description: 'O novo cliente foi adicionado com sucesso.',
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
    onError: (error: AxiosError | Error) => { 
      let errorMessage = 'Erro ao criar cliente. Por favor, tente novamente.';
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data?.errors) {
            errorMessage = error.response.data.errors.map((err: { message: string }) => err.message).join(', ');
        } else if (error.response.status === 409) {
            errorMessage = error.response.data.message || 'Email já cadastrado.';
        } else {
            errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error instanceof Error) {
          errorMessage = error.message; // Catch generic JS errors too
      }
      toast.error("Erro ao criar cliente",{
        description: errorMessage,
      });
    }
  });
}