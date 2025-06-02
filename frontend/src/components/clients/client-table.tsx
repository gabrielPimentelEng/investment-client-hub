// frontend/src/components/clients/client-table.tsx
import { useState } from 'react'; // Keep useState here for search input if it stays in the component
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Client } from '@/interfaces/interfaces'; 

interface ClientTableProps {
  clients: Client[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function ClientTable({ clients, searchTerm, onSearchTermChange }: ClientTableProps) {
  // Filter clients based on search term 
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Table Search Input */}
      <div className="mb-6">
        <Input
          placeholder="Procurar clientes"
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  {client.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={client.status === 'ACTIVE' ? 'default' : 'destructive'}
                    className={`
                      ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}
                    `}
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/clients/${client.id}`} passHref>
                    <Button variant="ghost" size="sm" className="inline-flex items-center">
                      Visualizar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Basic Pagination (can be expanded later) */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <span>Econtrados {filteredClients.length} Resultados</span>
      </div>
    </>
  );
}