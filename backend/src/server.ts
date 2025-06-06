import fastify from 'fastify';
import prismaPlugin from './plugins/prisma';
import fastifyCors from '@fastify/cors';
import { userRoutes } from "./routes/client";
import { assetRoutes } from './routes/asset';
import { clientAssetRoutes } from './routes/clientAsset';

const app = fastify({
  logger: true 
});

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
app.register(prismaPlugin);
app.register(userRoutes);
app.register(assetRoutes);
app.register(clientAssetRoutes);

const startServer = async () => { 
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001; 

    await app.listen({ port, host: '0.0.0.0' }); // Listen on 0.0.0.0 for Docker
  } catch (err) {
    app.log.error(err);
    process.exit(1); // Exit if startup fails
  }
};

startServer();