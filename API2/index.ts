import express from "express";
import { Connection, Channel, connect } from "amqplib";
import { RabbitmqServer } from "./rabbitmq-server";

async function start(){
  const conn: Connection = await connect("amqp://guest:guest@rabbitmq:5673"); 
  const channel: Channel = await conn.createChannel();
  const server = RabbitmqServer.getInstance(conn, channel);
  server.createQueue("teste");
}

const app = express();

start().then(async() => {
  const {routes} = await import("./config/routes");
  app.use(express.json());
  app.use(routes as any);
  app.listen(3334, () => {
    console.log("Servidor rodando...");
  });
});


