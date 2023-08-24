import 'dotenv/config.js';
import express from 'express';
import http from 'node:http';
import cors from 'cors';
import { sequelize } from './models/index.js';
import cookieParser from 'cookie-parser';
import models from './models/models.js';
import { ownRouter } from './routes/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import WebSocketServer from './ws/WebSocketServer.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: String(process.env.CLIENT_URL),
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use('/api', ownRouter);
app.use(errorHandlerMiddleware);
const server = http.createServer(app);
const start = async function () {
  console.log(models);
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};
const wsInstance = new WebSocketServer(server);
wsInstance.connection();
start();
