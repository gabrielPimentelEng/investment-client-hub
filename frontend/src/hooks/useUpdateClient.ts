import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Client } from '@/interfaces/interfaces';

import { updateClient, CreateUpdateClientPayload } from '@/lib/api/clients';

interface UseUpdateClientOptions {
    onSuccessCallback?: (updatedClient: Client) => void;
}

export function useUpdateClient(options?: UseUpdateClientOptions) {
  const queryClient = useQueryClient();

  return useMutation<Client, AxiosError | Error, { id: number; data: CreateUpdateClientPayload }>({
    mutationFn: ({ id, data }) => updateClient(id, data), // Call the API service function

    onSuccess: (updatedClient) => {
      // Invalidate the specific client's query AND the clients list query
      queryClient.invalidateQueries({ queryKey: ['client', updatedClient.id] });
      

      queryClient.setQueryData<Client[]>(['clients'], (oldClients) => {
        // If the 'clients' list isn't in the cache yet, or is empty,
        // Return undefined to keep current state.
        if (!oldClients) {
          return undefined; 
        }

        // Map over the old list to find the updated client by ID
        // and replace it with the fresh data from the server response.
        return oldClients.map(client =>
          client.id === updatedClient.id ? updatedClient : client
        );
      });
      // Reconcile the cache with the server, providing eventual consistency.
      queryClient.invalidateQueries({ queryKey: ['clients'] });

      options?.onSuccessCallback?.(updatedClient); // Call the passed callback

      toast.success("Cliente atualizado!", {
        description: `As informações de "${updatedClient.name}" foram salvas.`,
        action: {
          label: "Fechar",
          onClick: () => toast.dismiss(),
        },
      });
    },
    onError: (error: AxiosError | Error) => {
      let errorMessage = 'Erro ao atualizar cliente. Por favor, tente novamente.';

      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400 && (error.response.data as any)?.errors) {
          errorMessage = (error.response.data as any).errors.map((err: { message: string }) => err.message).join(', ');
        } else if (error.response.status === 409) {
          errorMessage = (error.response.data as any).message || 'Email já cadastrado.';
        } else {
          errorMessage = (error.response.data as any).message || errorMessage;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error("Erro ", {
        description: errorMessage,
      });
    },
  });
}