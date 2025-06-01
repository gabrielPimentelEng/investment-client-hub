import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PrismaClient, Prisma } from '../generated/prisma';
import { request } from 'http';


// export async function userRoutes(server: FastifyInstance) {
//   server.get('/clients', async (request, response) => {
//     const clients = await server.prisma.client.findMany();
//     return clients;
//     });
// }

// Extend FastifyRequest to include Prisma client
declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient;
  }
}

const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE').optional(),
})

const updateClientSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
}).partial();

const createAllocationSchema = z.object({
  assetId: z.number().int('Asset ID must be an integer'),
  quantity: z.number().positive('Quantity must be positive'),
});

// Schema for client ID parameter.
const clientParamsSchema = z.object({
  id: z.string().transform(Number), // Fastify params are strings, transform to number
});

export async function userRoutes(fastify: FastifyInstance){

  //GET - All clients
  fastify.get('/clients', async (request, reply) => {
    const clients = await fastify.prisma.client.findMany();
    return reply.send(clients);
  });

  fastify.get('/clients/:id', async (request, reply) => {
    const { id } = clientParamsSchema.parse(request.params);

    const client = await request.prisma.client.findUnique({
      where: { id },
    });
    
    if (!client) {
      return reply.code(404).send({ message: 'Client not found' });
    }
    return reply.send(client);
  });

  // POST - Register Client
  fastify.post('/clients', async (request, reply) => {
    try{
      const clientData = createClientSchema.parse(request.body);
      
      const client = await fastify.prisma.client.create({
        data: clientData,
      });

      return reply.code(201).send(client);
    } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({message: 'Validation error', errors: error.errors});
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
     if (error.code === 'P2002') {
        const target = error.meta?.target;
        if (target === 'Client_email_key') {
          return reply.code(409).send({ message: 'Client with this email already exists' });
        }
      }
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  }
});

  // PATCH - Update Client
  fastify.patch('/clients/:id', async (request, reply) => {
    try {
      const { id } = clientParamsSchema.parse(request.params); 
      const clientData = updateClientSchema.parse(request.body); 

      const updatedClient = await fastify.prisma.client.update({
        where: { id },
        data: clientData,
      });

      return reply.send(updatedClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: 'Validation error', errors: error.errors });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { 
          return reply.code(404).send({ message: 'Client not found' });
        }
      }
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });

  // DELETE - Delete a client
  fastify.delete('/clients/:id', async (request, reply) => {
    try {
      const { id } = clientParamsSchema.parse(request.params); 

      await fastify.prisma.client.delete({
        where: { id },
      });

      return reply.code(204).send({message: 'Client deleted successfully.'}); 
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') { // Prisma error for record not found for update/delete
          return reply.code(404).send({ message: 'Client not found' });
        }
      }
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });

  // GET - Get a client's allocations
  fastify.get('/clients/:clientId/allocations', async (request, reply) => {
    try {
      const { clientId } = z.object({ clientId: z.string().transform(Number) }).parse(request.params);

      const clientWithAllocations = await fastify.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          allocations: { // Include the ClientAsset model
            include: {
              asset: true, // Also include the related Asset details for each allocation
            },
          },
        },
      });

      if (!clientWithAllocations) {
        return reply.code(404).send({ message: 'Client not found' });
      }

      return reply.send(clientWithAllocations);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: 'Validation error', errors: error.errors });
      }
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });

  // Optional: Add a POST /clients/:clientId/allocations to add/update an allocation
  fastify.post('/clients/:clientId/allocations', async (request, reply) => {
    try {
      const { clientId } = z.object({ clientId: z.string().transform(Number) }).parse(request.params);
      const { assetId, quantity } = createAllocationSchema.parse(request.body);

      // Check if client and asset exist
      const clientExists = await fastify.prisma.client.findUnique({ where: { id: clientId } });
      if (!clientExists) {
        return reply.code(404).send({ message: 'Client not found' });
      }
      const assetExists = await fastify.prisma.asset.findUnique({ where: { id: assetId } });
      if (!assetExists) {
        return reply.code(404).send({ message: 'Asset not found' });
      }

      // Upsert (create or update) the allocation
      const allocation = await fastify.prisma.clientAsset.upsert({
        where: {
          clientId_assetId: { // This unique constraint allows upserting by composite key
            clientId: clientId,
            assetId: assetId,
          },
        },
        update: { quantity: quantity }, // Update quantity if allocation exists
        create: {
          clientId: clientId,
          assetId: assetId,
          quantity: quantity,
        },
      });

      return reply.code(200).send(allocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: 'Validation error', errors: error.errors });
      }
      request.log.error(error);
      return reply.code(500).send({ message: 'Internal server error' });
    }
  });
}