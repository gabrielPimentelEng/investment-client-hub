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


export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  // Hook for data fetching
  const { data: clients, isLoading, isError, error } = useClients();

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
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      {/* Header Section  */}
      <header className="w-full max-w-6xl flex justify-between items-center py-4 border-b border-gray-200 mb-8">
        <div className="text-2xl font-bold text-gray-800">Registros</div>
      </header>

      {/* Clients Section */}
      <section className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Clientes</h1>
          <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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

        {/* Render the ClientTable component, passing data and search props */}
        <ClientTable
          clients={clientsData}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
      </section>
    </main>
  );
}