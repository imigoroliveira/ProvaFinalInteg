import { Conta } from "../models/Conta";


const contas: Conta[] = [];

export class ContaRepository {
  
  listar() : Conta[] {
    return contas;
  }

  consultar() : Conta{
    return contas.find((conta) => 
      conta..cpf === cpf && conta.mes == mes && 
      conta.ano === ano)!;
  }

  cadastrar(contasNovas: Conta[]) : Conta[]{
    contasNovas.forEach((conta) => {
      contas.push(conta);
    });
    return contas;
  }
}
