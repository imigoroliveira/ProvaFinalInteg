export type Conta = {
    agencia: number;
    conta: number;
    pessoa: Pessoa;
  };
  
  type Pessoa = {
    nome: string;
    cpf: string;
  };
  