"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("./routes/client");
const asset_1 = require("./routes/asset");
const clientAsset_1 = require("./routes/clientAsset");
const app = (0, fastify_1.default)({
    logger: true
});
app.register(cors_1.default, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
app.register(prisma_1.default);
app.register(client_1.userRoutes);
app.register(asset_1.assetRoutes);
app.register(clientAsset_1.clientAssetRoutes);
const startServer = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        await app.listen({ port, host: '0.0.0.0' }); // Listen on 0.0.0.0 for Docker
    }
    catch (err) {
        app.log.error(err);
        process.exit(1); // Exit if startup fails
    }
};
startServer();
