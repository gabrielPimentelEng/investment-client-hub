// src/routes/asset.ts
import { FastifyInstance } from 'fastify';

// Define a simple type for your fixed assets
interface Asset {
  id: number;
  name: string;
  value: string; // Using string for value to match potential Decimal/float representation
}

// Hardcoded list of assets as per the requirements
const fixedAssets: Asset[] = [
  { id: 1, name: "Ação XYZ", value: "123.45" },
  { id: 2, name: "Fundo ABC", value: "50.00" },
  { id: 3, name: "Tesouro Direto", value: "1000.00" },
  { id: 4, name: "CDB Banco Seguro", value: "250.75" },
  { id: 5, name: "Bitcoin", value: "60000.00" } 
];

export async function assetRoutes(fastify: FastifyInstance) {

  // GET List all fixed assets
  fastify.get('/assets', async (request, reply) => {
    return reply.send(fixedAssets);
  });

}