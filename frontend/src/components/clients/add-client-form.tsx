'use client'

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateClient } from '@/hooks/useCreateClient';

const formSchema = z.object({
    name: z.string().min(3, 'Nome não pode ser menor do que 3 caracteres.'),
    email: z.string().min(1, 'Email é obrigatório.').email('Email inválido.'),
    status: z.enum(['ACTIVE', 'INACTIVE'], {
        errorMap: () => ({ message: 'Status must be ACTIVE or INACTIVE.'}), // Custom error message
    }),
});

export interface AddClientFormProps {
  onSuccess?: () => void;
}

type AddClientFormValues = z.infer<typeof formSchema>;

export function AddClientForm({ onSuccess }: AddClientFormProps) {

  // Define the form
  const form = useForm<AddClientFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
          name: '',
          email: '',
          status: 'ACTIVE',
      },
  });
  
  const { mutate, isPending } = useCreateClient({
    onSuccess: () => {
      onSuccess?.(); // Close the dialog
      form.reset(); 
    },
  });

  const onSubmit = (values: AddClientFormValues) => {
    mutate(values); // Trigger the mutation via the hook
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="cliente123@exemplo.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Criando...' : 'Criar Cliente'}
        </Button>

      </form>
    </Form>
  )
}