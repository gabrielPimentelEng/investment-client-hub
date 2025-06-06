'use client'; 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { ClientTable } from '@/components/clients/client-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddClientForm } from '@/components/clients/add-client-form';
import { EditClientForm } from '@/components/clients/edit-client-form';
import { Client } from '@/interfaces/interfaces';
import { useRouter } from 'next/navigation';


export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Hook for data fetching
  const { data: clients, isLoading, isError, error } = useClients();

  const router = useRouter();
  const clientsData = clients || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading clients...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>Error loading clients: {error?.message || 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[#f1f5f9]">
      {/* Header Section  */}
      <header className="w-full max-w-6xl flex justify-center items-center py-4 border-b border-gray-200 mb-8">
        <div className="text-2xl font-bold text-gray-800">Registros</div>
      </header>

      {/* Clients Section */}
      <section className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Clientes</h1>
          <div className='flex gap-4'>  
            <Button
              onClick={() => router.push('/assets')}   
              className='bg-blue-500 hover:bg-blue-600 text-white active:bg-blue-700'
            >
                  Ativos
            </Button>
            <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className='bg-blue-500 hover:bg-blue-600 text-white active:bg-blue-700'
                >
                  <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha o formulário abaixo para adicionar o novo cliente.
                  </DialogDescription>
                </DialogHeader>
                <AddClientForm onSuccess={() => setIsAddClientDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription>
                  Atualize as informações do cliente abaixo.
                </DialogDescription>
              </DialogHeader>

              {/* Ensure selectedClient is defined before rendering form */}
              {selectedClient && (
                <EditClientForm
                  client={selectedClient}
                  onSuccess={() => {
                    setIsEditClientDialogOpen(false);
                    setSelectedClient(null); // Optional: clear selected client
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Render the ClientTable component, passing data and search props */}
        <ClientTable
          clients={clientsData}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onEditClick={(client) => {
            setSelectedClient(client);
            setIsEditClientDialogOpen(true);
          }}
        />
      </section>
    </main>
  );
}