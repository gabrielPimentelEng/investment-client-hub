import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Client } from '@/interfaces/interfaces'; 

interface ClientTableProps {
  clients: Client[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onEditClick: (client: Client) => void; 
}

export function ClientTable({ clients, searchTerm, onSearchTermChange, onEditClick }: ClientTableProps) {
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
      <Table className=''>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nome</TableHead>
            <TableHead className="text-center">EMAIL</TableHead>
            <TableHead className="text-center">STATUS</TableHead>
            <TableHead className="text-center "> Cliente</TableHead>
            <TableHead className="text-center "> Ativos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="text-center">{client.name}</TableCell>
                <TableCell className="text-center">
                  {client.email}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={client.status === 'ACTIVE' ? 'default' : 'destructive'}
                    className={`
                      ${client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}
                    `}
                  >
                    {client.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => onEditClick(client)}
                  >
                    Editar
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/clients/${client.id}`} passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="inline-flex items-center"
                    >
                      Detalhes 
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

      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <span>Econtrados {filteredClients.length} Resultados</span>
      </div>
    </>
  );
}