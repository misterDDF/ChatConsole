import { Logger } from "../Common/Logger";
import { GameMsg, Proto, RoomCreateReq, RoomEnterReq, RoomCreateRsp, RoomEnterRsp, RoomListRsp, RoomLeaveRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { NetService } from "../Services/NetService";
import { SceneEvent, SceneService } from "../Services/SceneService";

export class CenterSystem{
    private static instance: CenterSystem;
    public static GetInstance(): CenterSystem{
        if(!this.instance){
            this.instance = new CenterSystem();
        }
        return this.instance;
    }

    public Init(){
        Logger.Log("CenterSystem init done.");
    }

    public SendRoomCreate(roomName: string){
        let content: RoomCreateReq = {roomName: roomName};
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_CREATE_REQ, "", content);
        NetService.GetInstance().SendMsg(msg);
    }

    public SendRoomList(){
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_LIST_REQ, "", {});
        NetService.GetInstance().SendMsg(msg);
    }

    public SendRoomEnter(roomId: number){
        let content: RoomEnterReq = {roomId: roomId};
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_ENTER_REQ, "", content);
        NetService.GetInstance().SendMsg(msg);
    }

    public SendRoomLeave(){
        let msg: GameMsg = new GameMsg(Proto.PROTO_ROOM_LEAVE_REQ, "", {});
        NetService.GetInstance().SendMsg(msg);
    }

    public HandleRoomCreateRsp(session: XNSession, content: RoomCreateRsp){
        Logger.Log(`Room create success, RoomId:{${content.roomId}}`);
        SceneService.GetInstance().SendSceneEvent(SceneEvent.room_create);
    }

    public HandleRoomListRsp(session: XNSession, content: RoomListRsp){
        Logger.Log('Room list fetch success, show room info.');
        SceneService.GetInstance().SendSceneEvent(SceneEvent.room_list, content.roomList);
    }

    public HandleRoomEnterRsp(session: XNSession, content: RoomEnterRsp){
        Logger.Log(`Room enter success, RoomId:{${content.roomId}}`);
        SceneService.GetInstance().SendSceneEvent(SceneEvent.room_enter);
    }

    public HandleRoomLeaveRsp(session: XNSession, content: RoomLeaveRsp){
        Logger.Log(`Room leave success, RoomId:{${content.roomId}}`);
        SceneService.GetInstance().SendSceneEvent(SceneEvent.room_leave, content.isForce);
    }
}