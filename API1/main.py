import uvicorn
import pika
from datetime import datetime
import json
from fastapi import FastAPI, Request

app = FastAPI()

movimentacoes = {}


@app.post("/conta/cadastrar")
async def cadastrar(request: Request):
    body = await request.body()
    payload_str = body.decode("utf-8")
    payload = json.loads(payload_str)

    agencia = payload.get("agencia")
    conta = payload.get("conta")
    queue_saque = f"{agencia}_{conta}_saque"
    queue_deposito = f"{agencia}_{conta}_deposito"

    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost:15672'))
    channel = connection.channel()
    channel.queue_declare(queue=queue_saque)
    channel.queue_declare(queue=queue_deposito)
    channel.queue_declare(queue="movimentacoes")
    return {"messsage": "Conta cadastrada com sucesso"}


@app.put("/conta/depositar/{agencia}/{conta}/{valor}")
async def depositar(agencia: str, conta: str, valor: float):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost:15672'))
    channel = connection.channel()
    channel.basic_publish(
        exchange='',
        routing_key=f"{agencia}_{conta}_deposito",
        body=json.dumps({"agencia": agencia, "conta": conta, "valor": valor})
    )

    channel.basic_publish(
        exchange='',
        routing_key="movimentacoes",
        body=json.dumps({"agencia": agencia, "conta": conta, "valor": valor})
    )
    if not agencia in movimentacoes.keys():
        movimentacoes[agencia] = {}

    if not conta in movimentacoes[agencia].keys():
        movimentacoes[agencia][conta] = []

    movimentacoes[agencia][conta].append({
        "data": datetime.now(),
        "tipo": "deposito",
        "valor": valor
    })

    return {"messsage": "Valor depositado com sucesso", "agencia": agencia, "conta": conta, "valor": valor}


@app.put("/conta/sacar/{agencia}/{conta}/{valor}")
async def sacar(agencia: str, conta: str, valor: float):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.basic_publish(
        exchange='',
        routing_key=f"{agencia}_{conta}_saque",
        body=json.dumps({"agencia": agencia, "conta": conta, "valor": valor})
    )

    if not agencia in movimentacoes.keys():
        movimentacoes[agencia] = {}

    if not conta in movimentacoes[agencia].keys():
        movimentacoes[agencia][conta] = []

    movimentacoes[agencia][conta].append({
        "data": datetime.now(),
        "tipo": "saque",
        "valor": valor
    })

    return {"messsage": "Valor sacado com sucesso", "agencia": agencia, "conta": conta, "valor": valor}


@app.get("/folha/movimentacoes/{agencia}/{conta}")
async def sacar(agencia: str, conta: str):
    if agencia in movimentacoes.keys():
        if conta in movimentacoes[agencia].keys() and movimentacoes[agencia][conta]:
            return movimentacoes[agencia][conta]

        else:
            return {"message": "Conta sem movimentações", "agencia": agencia, "conta": conta}
    else:
        return {"message": "Agencia sem movimentações", "agencia": agencia}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=6006)
