import { Connection, Channel, connect } from "amqplib";

export class RabbitmqServer{

    private static instance: RabbitmqServer;

    constructor(
        private connection: Connection,
        private channel: Channel
    ){
        
    }

    public send(queue: string, message: string){
        this.channel.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(message));
    }

    public receive(queue: string, callback: (message: string) => void){
        this.channel.assertQueue(queue);
        this.channel.consume(queue, (msg) => {
            if(msg){
                callback(msg.content.toString());
            }
        });
    }

    public createQueue(queue: string){
        this.channel.assertQueue(queue);
    }

    // create singleton

    public static getInstance(
        connection?: Connection,
        channel?: Channel
    ): RabbitmqServer{
        if(!RabbitmqServer.instance){
            if(connection && channel){
                RabbitmqServer.instance = new RabbitmqServer(connection, channel);
            }
        }
        return RabbitmqServer.instance;
    }
}
