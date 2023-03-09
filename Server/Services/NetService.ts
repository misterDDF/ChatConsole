import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { GameMsg, LoginReq, Proto, RegisterReq, RoomCreateReq, RoomEnterReq } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { XNSocket, EXCallbacks } from "../NetworkCommon/XNSocket";
import { CenterSystem } from "../System/CenterSystem";
import { LoginSystem } from "../System/LoginSystem";
import { CacheService } from "./CacheService";

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
    private cbCollect: Partial<EXCallbacks>;

    public constructor(){
        this.server = new XNSocket();
        this.cbCollect = {};
    }

    public Init(){
        this.cbCollect = {
            connectCB: this.onConnect,
            receiveCB: this.onReceiveMsg,
            disconnectCB: this.onDisconnect,
            errorCB: this.onError,
        }
        this.server.StartAsServer(ConstDefine.DEFAULT_PORT, this.cbCollect);
    }

    public onConnect(session: XNSession){

    }

    // 根据协议号转发数据给相关功能系统
    public onReceiveMsg(session:XNSession, msg: GameMsg){
        if(msg.errMsg !== ""){
            Logger.Log(msg.errMsg);
            return;
        }
        
        switch(msg.cmd){
            case Proto.PROTO_LOGIN_REQ:
                LoginSystem.GetInstance().HandleLoginReq(session, msg.content as LoginReq);
                break;
            case Proto.PROTO_REGISTER_REQ:
                LoginSystem.GetInstance().HandleRegisterReq(session, msg.content as RegisterReq);
                break;
            case Proto.PROTO_LOGOUT_REQ:
                LoginSystem.GetInstance().HandleLogoutReq(session);
                break;
            case Proto.PROTO_ROOM_CREATE_REQ:
                CenterSystem.GetInstance().HandleRoomCreateReq(session, msg.content as RoomCreateReq);
                break;
            case Proto.PROTO_ROOM_LIST_REQ:
                CenterSystem.GetInstance().HandleRoomListReq(session);
                break;
            case Proto.PROTO_ROOM_ENTER_REQ:
                CenterSystem.GetInstance().HandleRoomEnterReq(session, msg.content as RoomEnterReq);
                break;
            default:
                Logger.Log(`Invalid proto string: ${msg.cmd.toString()}`);
        }
    }

    public onDisconnect(session: XNSession){
        CacheService.GetInstance().RemovePlayerCache(undefined, session);
    }

    public onError(session: XNSession, errMsg: string){
        CacheService.GetInstance().RemovePlayerCache(undefined, session);
    }

    public SendMsg(session: XNSession, msg: GameMsg){
        session.SendMsg(msg);
    }
}