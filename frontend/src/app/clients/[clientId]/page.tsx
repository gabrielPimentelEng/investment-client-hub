'use client';

import { useState } from 'react';
import { AddAllocationForm } from '@/components/add-allocation-form'; 
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useClientAsset } from '@/hooks/useClientAsset'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Plus } from 'lucide-react';

export default function TestAllocationPage() {
  const [isAddAllocationDialogOpen, setIsAddAllocationDialogOpen] = useState(false); 
  
  const params = useParams();
  const router = useRouter();
  
  const clientId = Number(params.clientId); 
  
  const { data: clientAllocationsData, isLoading: isLoadingClientAllocations } = useClientAsset(clientId);

  const formattedCreatedAt = clientAllocationsData?.createdAt ? format(new Date(clientAllocationsData.createdAt), 'dd/MM/yyyy HH:mm') : null
  const formattedUpdatedAt = clientAllocationsData?.updatedAt ? format(new Date(clientAllocationsData.updatedAt), 'dd/MM/yyyy HH:mm') : null

  return (
    <main className="flex min-h-screen flex-col items-center p-8  bg-[#f1f5f9]">
      
      <div className='flex w-full justify-start'>
        <Button
          onClick={() => router.back()}
          className="p-2 -ml-2 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 active:bg-gray-100" 
        >
          <ArrowLeft className="h-5 w-5 mr-2 text-gray-800" />
          <h1 className='text-gray-800'>Voltar</h1>
        </Button>
      </div>
      <h1 className="self-center text-3xl font-bold text-gray-800 mb-8">Visualização de Dados do Cliente</h1>

      <Card className="w-full max-w-2xl shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {/* If allocations are loading, show a skeleton for the client name  */}
            {isLoadingClientAllocations ? <Skeleton className="h-8 w-48" /> : clientAllocationsData?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoadingClientAllocations ? (
            // Skeletons for client details while allocations are loading
            <>
              <Skeleton className="h-4 w-32" /> {/* ID */}
              <Skeleton className="h-4 w-48" /> {/* Email */}
              <Skeleton className="h-4 w-24" /> {/* Status */}
              <Skeleton className="h-4 w-40" /> {/* CreatedAt */}
              <Skeleton className="h-4 w-40" /> {/* UpdatedAt */}
            </>
          ) : (
            // Client details
            <>
                <p><strong>ID:</strong> {clientAllocationsData?.id}</p>
            <div className='grid grid-cols-2'>
              <div className=''>
                <div><span className='font-bold'>Email:</span> {clientAllocationsData?.email}</div>
                <div><span className='font-bold'>Criado em:</span> {formattedCreatedAt}</div>
              </div>
              <div className=''>
                <div><span className='font-bold'>Status:</span> {clientAllocationsData?.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</div>
                <div><span className='font-bold'>Última Atualização:</span> {formattedUpdatedAt}</div>
              </div>
            </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Allocations Section */}
      <section className="w-full max-w-2xl  rounded-lg ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Alocações de Ativos</h2>
          <Dialog open={isAddAllocationDialogOpen} onOpenChange={setIsAddAllocationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Ativo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Ativo ao Cliente</DialogTitle>
                <DialogDescription>
                  Selecione um ativo e especifique a quantidade para alocar a {clientAllocationsData?.name}.
                </DialogDescription>
              </DialogHeader>
              <AddAllocationForm
                clientId={clientAllocationsData?.id as number}
                onClose={() => setIsAddAllocationDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoadingClientAllocations ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" /> 
                  <Skeleton className="h-4 w-1/2" /> 
                  <Skeleton className="h-4 w-2/3" /> 
                  <Skeleton className="h-4 w-1/3" /> 
                </div>
              </Card>
            ))}
          </div>
        ) : clientAllocationsData?.allocations && clientAllocationsData?.allocations.length > 0 ? (
          <div className="space-y-4">
            {clientAllocationsData.allocations.map(allocation => {
              // Ensure parsing from string to number
              const parsedQuantity = parseFloat(allocation.quantity);
              const parsedAssetValue = parseFloat(allocation.asset.value); 
              const totalValue = parsedQuantity * parsedAssetValue;

              return (
                <Card key={allocation.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-lg">
                  <div>
                    <h3 className="text-lg font-semibold">{allocation.asset.name}</h3>
                    <p className="text-sm text-gray-600">
                      Quantidade: <span className="font-medium">{parsedQuantity}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Valor por unidade: <span className="font-medium">R$ {parsedAssetValue}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Valor Total: <span className="font-medium">R$ {totalValue}</span>
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum ativo alocado para este cliente.</p>
        )}
      </section>
    </main>
  );
}
