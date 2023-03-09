import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { RoomInfo } from "../NetworkCommon/GameMsg";
import { Command } from "../Services/CommandService";
import { SceneEvent, SceneService } from "../Services/SceneService";
import { CenterSystem } from "../System/CenterSystem";
import { LoginSystem } from "../System/LoginSystem";
import { SceneBase } from "./SceneBase";

enum CenterCommandType{
    none = 'none',
    create = 'create',
    list = 'list',
    enter = 'enter',
    logout = 'logout',
}

export class CenterScene extends SceneBase{
    private static instance: CenterScene;
    public static GetInstance(): CenterScene{
        if(!this.instance){
            this.instance = new CenterScene();
        }
        return this.instance;
    }
    
    public Init(){
        super.Init();
    }

    public OnEnterScene(): void {
        super.OnEnterScene();
        Logger.Log("*****Enter Center Scene*****");

        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.room_create, this.DisplayRoomCreate);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.room_list, this.DisplayRoomList);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.room_enter, this.DisplayRoomEnter);

        console.log("Support command: 1)create 2)list 3)enter 4)logout")
    }

    public OnExitScene(): void {
        super.OnExitScene();

        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.room_create, this.DisplayRoomCreate);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.room_list, this.DisplayRoomList);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.room_enter, this.DisplayRoomEnter);

        Logger.Log("*****Exit Center Scene*****");
    }

    public OnReceiveCommand(cmd: Command): void {
        super.OnReceiveCommand(cmd);
        switch(cmd.operation){
            case CenterCommandType.create.toString():
                if(this.CheckParamsCount(cmd, 1)){
                    CenterSystem.GetInstance().SendRoomCreate(cmd.params[0]);
                }
                break;
            case CenterCommandType.list.toString():
                if(this.CheckParamsCount(cmd, 0)){
                    CenterSystem.GetInstance().SendRoomList();
                }
                break;
            case CenterCommandType.enter.toString():
                if(this.CheckParamsCount(cmd, 1)){
                    CenterSystem.GetInstance().SendRoomEnter(Number(cmd.params[0]));
                }
                break;
            case CenterCommandType.logout.toString():
                if(this.CheckParamsCount(cmd, 0)){
                    LoginSystem.GetInstance().SendLogoutReq();
                }
                break;
            default:
                Logger.LogError(`Invalid login scene command: ${cmd.operation}`);
        }
    }

    public DisplayRoomCreate(params?: any[]){

    }

    public DisplayRoomList(params?: any[]){
        if(params){
            let roomList: RoomInfo[] = params[0];
            console.log('Room list fetch success, show room info.')
            roomList.forEach(roomInfo => {
                console.log(`${roomInfo.roomId}) Name: ${roomInfo.roomName} Member: ${roomInfo.curMemberCount}/${ConstDefine.MAX_MEMBER_COUNT}\n`);
            });
        }
    }

    public DisplayRoomEnter(params?: any[]){

    }
}