import { RabbitmqServer } from '../rabbitmq-server';
import { Request, Response } from "express";
import { Conta } from "../models/Conta";
import { ContaRepository } from "../repositories/ContaRepository";

const contarRepository = new ContaRepository();

export class ContaController {
  private rabbitmqServer;

  constructor(){
    this.rabbitmqServer = RabbitmqServer.getInstance();
    this.rabbitmqServer.receive("teste", this.consultar.bind(this));
  }

  consultar(request: Request, response: Response) {
    const contas = contarepo.listar();
    const total = 
      contas.reduce((total, conta) => total + conta.liquido, 0);
    const dados = {
      array: contas,
      soma:  total
    };
    return response.status(200).json(dados);
  }

  consultMov(request: Request, response: Response) {
    const {cpf, mes, ano} = request.params;
    const conta = contarepo.consultar(
      cpf, Number.parseInt(mes), Number.parseInt(ano)
    );
    return response.status(200).json(conta);
  }
}
