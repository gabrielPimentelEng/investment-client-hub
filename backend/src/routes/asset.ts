// src/routes/asset.ts
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '../generated/prisma';
import { z } from 'zod'; // Import Zod

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// // Hardcoded list of assets as per the requirements
// const fixedAssets: Asset[] = [
//   { id: 1, name: "Ação XYZ", value: "123.45" },
//   { id: 2, name: "Fundo ABC", value: "50.00" },
//   { id: 3, name: "Tesouro Direto", value: "1000.00" },
//   { id: 4, name: "CDB Banco Seguro", value: "250.75" },
//   { id: 5, name: "Bitcoin", value: "60000.00" } 
// ];
const createAssetBodySchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Value must be a valid monetary amount (e.g., "123.45")'), // Assumes string format for value
});


export async function assetRoutes(fastify: FastifyInstance) {

  // GET List all fixed assets
  fastify.get('/assets', async (request, reply) => {
    try {
      const assets = await fastify.prisma.asset.findMany();
      return reply.send(assets);
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ message: 'Failed to retrieve assets from the database.' });
    }
  });

  // POST Create a new asset
  fastify.post('/assets', async (request, reply) => {
    try {
      // 1. Validate the request body using Zod
      const { name, value } = createAssetBodySchema.parse(request.body);

      // 2. Create the new asset in the database
      const newAsset = await fastify.prisma.asset.create({
        data: {
          name,
          value, // Prisma will handle the conversion from string to Decimal if your model uses Decimal
        },
      });

      // 3. Send back the created asset with a 201 Created status
      return reply.status(201).send(newAsset);

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors from Zod
        request.log.warn('Validation error creating asset:', error.errors);
        return reply.status(400).send({ message: 'Validation failed', issues: error.errors });
      } else {
        // Handle other potential database or server errors
        request.log.error('Error creating asset:', error);
        return reply.status(500).send({ message: 'Failed to create asset' });
      }
    }
  });

}