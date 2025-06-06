'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateClientAsset } from '@/hooks/useCreateClientAsset';
import { useAssets } from '@/hooks/useAssets';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  assetId: z.coerce
    .number({
      invalid_type_error: 'Selecione um ativo válido.',
    })
    .int()
    .positive(),
  quantity: z.coerce
    .number({
      required_error: 'Quantidade é obrigatória.',
      invalid_type_error: 'Você deve digitar um número positivo válido (separado por "." ).',
    })
    .positive().refine(val => !isNaN(val), {
    message: 'Quantidade é obrigatória.',
  }),
});


type AllocationFormValues = z.infer<typeof formSchema>;

interface AddAllocationFormProps {
  clientId: number;
  onClose?: () => void;
}

export function AddAllocationForm({ clientId, onClose }: AddAllocationFormProps) {

  const { data: assets = [], isLoading } = useAssets();

  const form = useForm<AllocationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetId: 1,
      quantity: 1,
    },
  });

  const { mutate, isPending } = useCreateClientAsset({
    data: {
      clientId,
      assetId: form.watch('assetId'),
      quantity: form.watch('quantity'),
    },
    onSuccess: () => {
      form.reset({ assetId: 1, quantity: 1 });
      onClose?.();
    },
  });

  const onSubmit = (values: AllocationFormValues) => {
    mutate({
      clientId,
      assetId: values.assetId,
      quantity: values.quantity,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ativo</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                step="any"          // Allows any decimal value
                min="0"             
                placeholder="ex: 5.4 ou 10" // Hint for user
                value={field.value ?? ''} // Display value; if undefined/null, show empty string
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    field.onChange(undefined); // Pass undefined for empty string to trigger 'required_error'
                  } else {
                    field.onChange(value);
                  }
                }}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full " disabled={isPending}>
          {isPending ? 'Alocando...' : 'Alocar Ativo'}
        </Button>
      </form>
    </Form>
  );
}

