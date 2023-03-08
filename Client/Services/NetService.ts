import { ConstDefine } from "../Common/ConstDefine";
import { GameMsg, LoginRsp, LogoutRsp, Proto, RegisterRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { XNSocket, EXCallbacks } from "../NetworkCommon/XNSocket";
import { LoginSystem } from "../System/LoginSystem";

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
    private cbCollect: Partial<EXCallbacks>;
    
    public constructor(){
        this.client = new XNSocket();
        this.session = new XNSession();
        this.cbCollect = {};
    }

    public Init(){
        this.cbCollect = {
            connectCB: this.onConnect,
            receiveCB: this.onReceiveMsg,
            disconnectCB: this.onDisconnect,
            errorCB: this.onError,
        }
        this.client.StartAsClient(ConstDefine.DEFAULT_PORT, this.cbCollect);
        this.session = this.client.session as XNSession;
    }

    public SendMsg(msg: GameMsg){
        this.client.session?.SendMsg(msg);
    }

    public onConnect(session: XNSession){

    }

    // 根据协议号转发数据给相关功能系统
    public onReceiveMsg(session: XNSession, msg: GameMsg){
        if(msg.errMsg !== ""){
            console.log(msg.errMsg);
            return;
        }

        switch(msg.cmd){
            case Proto.PROTO_LOGIN_RSP:
                LoginSystem.GetInstance().HandleLoginRsp(session, msg.content as LoginRsp);
                break;
            case Proto.PROTO_REGISTER_RSP:
                LoginSystem.GetInstance().HandleRegisterRsp(session, msg.content as RegisterRsp);
                break;
            case Proto.PROTO_LOGOUT_RSP:
                LoginSystem.GetInstance().HandleLogoutRsp(session, msg.content as LogoutRsp);
                break;
            default:
                console.log("Invalid proto string: %s", msg.cmd.toString());
        }
    }

    public onDisconnect(session: XNSession){

    }

    public onError(session: XNSession, errMsg: string){

    }

    public CloseConnection(){
        this.client.socket?.end();
    }
}