"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../generated/prisma");
const createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().min(1, 'Email is required').email('Invalid email format'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE').optional(),
});
const updateClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
}).partial();
// Schema for client ID parameter.
const clientParamsSchema = zod_1.z.object({
    id: zod_1.z.string().transform(Number), // Fastify params are strings, transform to number
});
async function userRoutes(fastify) {
    //GET - All clients
    fastify.get('/clients', async (request, reply) => {
        const clients = await fastify.prisma.client.findMany();
        return reply.send(clients);
    });
    fastify.get('/clients/:id', async (request, reply) => {
        const { id } = clientParamsSchema.parse(request.params);
        const client = await fastify.prisma.client.findUnique({
            where: { id },
        });
        if (!client) {
            return reply.code(404).send({ message: 'Client not found' });
        }
        return reply.send(client);
    });
    // POST - Register Client
    fastify.post('/clients', async (request, reply) => {
        try {
            const clientData = createClientSchema.parse(request.body);
            const client = await fastify.prisma.client.create({
                data: clientData,
            });
            return reply.code(201).send(client);
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.code(400).send({ message: 'Validation error', errors: error.errors });
            }
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return reply.code(400).send({ message: 'Validation error', errors: error.errors });
            }
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
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
            return reply.code(204).send({ message: 'Client deleted successfully.' });
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') { // Prisma error for record not found for update/delete
                    return reply.code(404).send({ message: 'Client not found' });
                }
            }
            request.log.error(error);
            return reply.code(500).send({ message: 'Internal server error' });
        }
    });
}
