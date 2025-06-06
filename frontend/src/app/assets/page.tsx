'use client';

import { useAssets } from '@/hooks/useAssets';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AssetsPage() {
  const { data: assets, isLoading, isError, error } = useAssets();
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando ativos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        <p>Erro ao carregar ativos: {error?.message || 'Erro desconhecido'}</p>
        <Link href="/">
          <Button variant="outline" className="ml-4">Voltar para Início</Button>
        </Link>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#f1f5f9]">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle>Nenhum Ativo Encontrado</CardTitle>
            <CardDescription>Não há ativos fixos cadastrados no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Verifique a configuração do seu backend e a execução do script de seed.
            </p>
          </CardContent>
        </Card>
        <Button
          onClick={() => router.back()}
          className="p-2 -ml-2 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 active:bg-gray-100" 
        >
          <ArrowLeft className="h-5 w-5 mr-2 text-gray-800" />
          <h1 className='text-gray-800'>Voltar</h1>
        </Button>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-[#f1f5f9]">
        <div className='flex w-full justify-start'>
        <Button
          onClick={() => router.back()}
          className="p-2 -ml-2 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 active:bg-gray-100" 
        >
          <ArrowLeft className="h-5 w-5 mr-2 text-gray-800" />
          <h1 className='text-gray-800'>Voltar</h1>
        </Button>
        </div>
      <header className="w-full max-w-3xl flex justify-center items-center py-4 border-b border-gray-200 mb-8">
        <div className="text-2xl font-bold text-gray-800">Registros de Ativos</div>
      </header>

      <section className="w-full max-w-3xl   rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Ativos Fixos</h1>

        <div className="flex flex-col gap-4">
          {assets.map(asset => (
            <Card key={asset.id} className='shadow-md'>
              <CardHeader>
                <CardTitle>{asset.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-gray-700">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.value)} {/* Format for Brazilian currency */}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}