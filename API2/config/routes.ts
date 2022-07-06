import { Router } from "express";
import { ContaController } from "../controllers/ContaController";

const routes = Router();

//Default
routes.get("/", (request, response) => {
  response.json({ message: "API de Conta" });
});

const controller = new ContaController();
//COnta
routes.get("/conta/saldo/:agencia/:conta", (request, response) => controller.consultar(request, response));
routes.get("/folha/movimentacoes/:agencia/:conta", (request, response) => controller.consultMov(request, response));

export { routes };
