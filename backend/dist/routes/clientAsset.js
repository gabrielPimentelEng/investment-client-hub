"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientAssetRoutes = clientAssetRoutes;
const zod_1 = require("zod");
const createClientAssetSchema = zod_1.z.object({
    assetId: zod_1.z.number().int('Asset ID must be an integer'),
    quantity: zod_1.z.number().positive('Quantity must be positive'),
});
async function clientAssetRoutes(fastify) {
    // GET - Get a client's allocations
    fastify.get('/clients/:clientId/clientAsset', async (request, reply) => {
        try {
            const { clientId } = zod_1.z.object({ clientId: zod_1.z.string().transform(Number) }).parse(request.params);
            const clientAsset = await fastify.prisma.client.findUnique({
                where: { id: clientId },
                include: {
                    allocations: {
                        include: {
                            asset: true, // Also include the related Asset details for each allocation
                        },
                    },
                },
            });
            if (!clientAsset) {
                return reply.code(404).send({ message: 'Client not found' });
            }
            return reply.send(clientAsset);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.code(400).send({ message: 'Validation error', errors: error.errors });
            }
            request.log.error(error);
            return reply.code(500).send({ message: 'Internal server error' });
        }
    });
    //  POST  to add/update an allocation
    fastify.post('/clients/:clientId/clientAsset', async (request, reply) => {
        try {
            const { clientId } = zod_1.z.object({ clientId: zod_1.z.string().transform(Number) }).parse(request.params);
            const { assetId, quantity } = createClientAssetSchema.parse(request.body);
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
            const clientAsset = await fastify.prisma.clientAsset.upsert({
                where: {
                    clientId_assetId: {
                        clientId: clientId,
                        assetId: assetId,
                    },
                },
                update: { quantity: quantity }, // Update quantity if clientAsset exists
                create: {
                    clientId: clientId,
                    assetId: assetId,
                    quantity: quantity,
                },
                include: {
                    asset: true, // Include the related Asset details in the response
                },
            });
            // update the field updatedAt in the client table
            await fastify.prisma.client.update({
                where: { id: clientId },
                data: { updatedAt: new Date() },
            });
            return reply.code(200).send(clientAsset);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.code(400).send({ message: 'Validation error', errors: error.errors });
            }
            request.log.error(error);
            return reply.code(500).send({ message: 'Internal server error' });
        }
    });
}
