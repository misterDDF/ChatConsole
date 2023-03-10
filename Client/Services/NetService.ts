import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { ChatReplyRsp, ChatRollRsp, ChatSayRsp, GameMsg, GMKickRsp, GMMemberListRsp, LoginRsp, LogoutRsp, Proto, RegisterRsp, RoomCreateRsp, RoomEnterRsp, RoomLeaveRsp, RoomListRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { XNSocket, EXCallbacks } from "../NetworkCommon/XNSocket";
import { CenterSystem } from "../System/CenterSystem";
import { ChatSystem } from "../System/ChatSystem";
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
            case Proto.PROTO_ROOM_LEAVE_RSP:
                CenterSystem.GetInstance().HandleRoomLeaveRsp(session, msg.content as RoomLeaveRsp);
                break;
            case Proto.PROTO_CHAT_SAY_RSP:
                ChatSystem.GetInstance().HandleChatSayRsp(session, msg.content as ChatSayRsp);
                break;
            case Proto.PROTO_CHAT_REPLY_RSP:
                ChatSystem.GetInstance().HandleChatReplyRsp(session, msg.content as ChatReplyRsp);
                break;
            case Proto.PROTO_CHAT_ROLL_RSP:
                ChatSystem.GetInstance().HandleChatRollRsp(session, msg.content as ChatRollRsp);
                break;
            case Proto.PROTO_GM_MEMBERLIST_RSP:
                ChatSystem.GetInstance().HandleGMMemberListRsp(session, msg.content as GMMemberListRsp);
                break;
            case Proto.PROTO_GM_KICK_RSP:
                ChatSystem.GetInstance().HandleGMKickRsp(session, msg.content as GMKickRsp);
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