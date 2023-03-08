import { Logger } from "../Common/Logger";
import { Command } from "../Services/CommandService";
import { LoginSystem } from "../System/LoginSystem";
import { SceneBase } from "./SceneBase";

enum CenterCommandType{
    none = 'none',
    create = 'create',
    list = 'list',
    enter = 'enter',
    refresh = 'refresh',
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

        console.log("Support command: 1)create 2)list 3)enter 4)refresh 5)logout")
    }

    public OnExitScene(): void {
        super.OnExitScene();
        Logger.Log("*****Exit Center Scene*****");
    }

    public OnReceiveCommand(cmd: Command): void {
        super.OnReceiveCommand(cmd);
        switch(cmd.operation){
            case CenterCommandType.create.toString():
                break;
            case CenterCommandType.list.toString():
                break;
            case CenterCommandType.refresh.toString():
                break;
            case CenterCommandType.logout.toString():
                if(cmd.params.length > 0){
                    Logger.Log(`Invalid param count for center command: ${cmd.operation}`);
                    break;
                }
                LoginSystem.GetInstance().SendLogoutReq();
                break;
            default:
                Logger.LogError(`Invalid login scene command: ${cmd.operation}`);
        }
    }
}