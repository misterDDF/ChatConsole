import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { GameMsg, LoginRsp, LogoutRsp, Proto, RegisterRsp, RoomCreateRsp, RoomEnterRsp, RoomListRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { XNSocket, EXCallbacks } from "../NetworkCommon/XNSocket";
import { CenterSystem } from "../System/CenterSystem";
import { LoginSystem } from "../System/LoginSystem";

export class NetService{
    private static instance: NetService;
    public static GetInstance(): NetService{
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

        Logger.Log('NetService init done.')
    }

    public SendMsg(msg: GameMsg){
        this.client.session?.SendMsg(msg);
    }

    public onConnect(session: XNSession){

    }

    // 根据协议号转发数据给相关功能系统
    public onReceiveMsg(session: XNSession, msg: GameMsg){
        if(msg.errMsg !== ""){
            Logger.Log(msg.errMsg);
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
            case Proto.PROTO_ROOM_CREATE_RSP:
                CenterSystem.GetInstance().HandleRoomCreateRsp(session, msg.content as RoomCreateRsp);
                break;
            case Proto.PROTO_ROOM_LIST_RSP:
                CenterSystem.GetInstance().HandleRoomListRsp(session, msg.content as RoomListRsp);
                break;
            case Proto.PROTO_ROOM_ENTER_RSP:
                CenterSystem.GetInstance().HandleRoomEnterRsp(session, msg.content as RoomEnterRsp);
                break;
            default:
                Logger.Log(`Invalid proto string: ${msg.cmd.toString()}`);
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