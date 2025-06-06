'use client';

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

import { Client } from '@/interfaces/interfaces'; 
import { useUpdateClient } from '@/hooks/useUpdateClient'; 

// Zod schema for form validation (same as AddClientForm)
const formSchema = z.object({
  name: z.string().min(3, 'Nome não pode ser menor do que 3 caracteres.'),
  email: z.string().min(1, 'Email é obrigatório.').email('Email inválido.'),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    errorMap: () => ({ message: 'Status deve ser ATIVO ou INATIVO.' }),
  }),
});

type EditClientFormValues = z.infer<typeof formSchema>;

interface EditClientFormProps {
  client: Client; // The existing client data to pre-fill the form
  onSuccess?: () => void; // Optional callback after successful update
}

export function EditClientForm({ client, onSuccess }: EditClientFormProps) {
  // 1. FORM SETUP (React Hook Form + Zod)
  const form = useForm<EditClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client.name ?? '' ,
      email: client.email ?? '',
      status: client.status ?? 'ACTIVE',
    },
  });

  // 2. MUTATION USAGE
  const { mutate, isPending } = useUpdateClient({
    onSuccessCallback: (updatedClient) => {
      onSuccess?.(); // Call parent's callback
      // Optionally, form.reset(updatedClient) if you want to update form state with server response
    },
  });

  // 3. SUBMISSION HANDLER
  const onSubmit = (values: EditClientFormValues) => {
    // Pass the client ID and the updated data to the mutation
    mutate({ id: client.id, data: values });
    console.log('Form submitted with values:', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
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

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
    </Form>
  );
}