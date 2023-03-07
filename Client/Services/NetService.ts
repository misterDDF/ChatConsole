import { GameMsg, Proto } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { XNSocket } from "../NetworkCommon/XNSocket";

export class NetService{
    private static instance: NetService;
    public static getInstance(): NetService{
        if(this.instance){
            return this.instance;
        }
        this.instance = new NetService();
        return this.instance;
    }
    
    public client: XNSocket;
    public session: XNSession;
    
    public constructor(){
        this.client = new XNSocket();
        this.session = new XNSession();
    }

    public Init(){
        let port = 80;
        this.client.StartAsClient(port, this.onReceiveMsg);
        this.session = this.client.session as XNSession;
    }

    public SendMsg(msg: GameMsg){
        this.client.session?.SendMsg(msg);
    }

    public onReceiveMsg(msg: GameMsg){
        switch(msg.cmd){
            case Proto.PROTO_LOGIN_RSP:
                break;
            case Proto.PROTO_REGISTER_RSP:
                break;
            default:
                console.log("Invalid proto string: %s", msg.cmd.toString());
        }
    }
}