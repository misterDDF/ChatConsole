import { ConstDefine } from "../Common/ConstDefine";
import { ErrorCode } from "../NetworkCommon/ErrorCode";
import { GameMsg, Proto, RoomCreateReq, RoomCreateRsp, RoomEnterReq, RoomEnterRsp, RoomLeaveRsp, RoomListRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { CacheService, PlayerCache } from "../Services/CacheService";
import { NetService } from "../Services/NetService";

// 大厅房间数据管理
export class CenterSystem{
    private static instance: CenterSystem;
    public static GetInstance(){
        if(!this.instance){
            this.instance = new CenterSystem();
        }
        return this.instance;
    }

    public Init(){
        setInterval(()=>{
            CacheService.GetInstance().UpdateAllRoomCache();
        }, ConstDefine.ROOM_UPDATE_TIME);
    }

    public SendRoomLeaveRsp(session: XNSession, player: PlayerCache, isForce: boolean){
        let _content: RoomLeaveRsp = {isSuccess: true, roomId: player.roomId, isForce: isForce};
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_LEAVE_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
        CacheService.GetInstance().RemoveMemeberFromRoom(player.roomId, player);
    }

    public HandleRoomCreateReq(session: XNSession, content: RoomCreateReq){
        let player: PlayerCache | undefined = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, createe room failed`;
            let _content: RoomEnterRsp = {isSuccess: false, roomId: -1};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_CREATE_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let roomId = CacheService.GetInstance().CreateRoomCache(content.roomName, player);
        if(roomId < 0){
            let errorCode = ErrorCode.ROOM_CREATE_MAXCOUNT.toString();
            let errMsg = `{errorCode: ${errorCode}} Room count reaches max count, create room failed`;
            let _content: RoomCreateRsp = {isSuccess: false, roomId: -1};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_CREATE_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        let _content: RoomCreateRsp = {isSuccess: true, roomId: roomId};
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_CREATE_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
        CacheService.GetInstance().AddMemeberToRoom(roomId, player);
    }

    public HandleRoomListReq(session: XNSession){
        let roomList = CacheService.GetInstance().GetRoomList();
        let _content: RoomListRsp = {isSuccess: true, roomList: roomList};
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_LIST_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
    }

    public HandleRoomEnterReq(session: XNSession, content: RoomEnterReq){
        let room = CacheService.GetInstance().GetRoomCache(content.roomId);
        let player = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(room && room.state.members.length >= ConstDefine.MAX_MEMBER_COUNT){
            let errorCode = ErrorCode.ROOM_MEMBER_MAXCOUNT.toString();
            let errMsg = `{errorCode: ${errorCode}} Room member count reaches max count, enter room failed`;
            let _content: RoomEnterRsp = {isSuccess: false, roomId: -1};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_ENTER_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(!room){
            let errorCode = ErrorCode.ROOM_ID_NOTEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Room id not exist, enter room failed`;
            let _content: RoomEnterRsp = {isSuccess: false, roomId: -1};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_ENTER_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, enter room failed`;
            let _content: RoomEnterRsp = {isSuccess: false, roomId: -1};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_ENTER_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        let _content: RoomEnterRsp = {isSuccess: true, roomId: content.roomId};
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_ENTER_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
        CacheService.GetInstance().AddMemeberToRoom(content.roomId, player);
    }

    public HandleRoomLeaveReq(session: XNSession){
        let player = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, leave room failed`;
            let _content: RoomLeaveRsp = {isSuccess: false, roomId: -1, isForce: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_LEAVE_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let room = CacheService.GetInstance().GetRoomCache(player.roomId);
        if(!room){
            let errorCode = ErrorCode.ROOM_ID_NOTEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Room id not exist, leave room failed`;
            let _content: RoomLeaveRsp = {isSuccess: false, roomId: -1, isForce: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_LEAVE_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        this.SendRoomLeaveRsp(session, player, false);
    }
}