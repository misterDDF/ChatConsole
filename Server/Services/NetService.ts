import { GameMsg, Proto } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { XNSocket } from "../NetworkCommon/XNSocket";

// 基础网络通信服务，主要负责收发包
export class NetService{
    private static instance: NetService;

    public static GetInstance(): NetService{
        if(!this.instance){
            this.instance = new NetService();
        }
        return this.instance;
    }

    public server: XNSocket;

    public constructor(){
        this.server = new XNSocket();
    }

    public Init(){
        let port = 80;
        this.server.StartAsServer(port, this.onReceiveMsg);
    }

    // 根据协议号转发数据给相关功能系统
    public onReceiveMsg(msg: GameMsg){
        switch(msg.cmd){
            case Proto.PROTO_LOGIN_REQ:
                break;
            case Proto.PROTO_REGISTER_REQ:
                break;
        }
    }

    public SendMsg(session: XNSession, msg: GameMsg){
        session.SendMsg(msg);
    }
}