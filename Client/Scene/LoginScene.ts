import { Logger } from "../Common/Logger";
import { Command } from "../Services/CommandService";
import { LoginSystem } from "../System/LoginSystem";
import { SceneBase } from "./SceneBase";

enum LoginCommandType{
    none = 'none',
    login = 'login',
    register = 'register',
}

export class LoginScene extends SceneBase{
    private static instance: LoginScene;
    public static GetInstance(): LoginScene{
        if(!this.instance){
            this.instance = new LoginScene();
        }
        return this.instance;
    }

    public Init(){
        super.Init();
    }

    public override OnEnterScene(): void {
        super.OnEnterScene();
        Logger.Log("*****Enter Login Scene*****");

        console.log("Support command: 1)register 2)login")
    }

    public override OnExitScene(): void {
        super.OnExitScene();
        Logger.Log("*****Exit Login Scene*****");
    }

    public override OnReceiveCommand(cmd: Command): void {
        super.OnReceiveCommand(cmd);
        switch(cmd.operation){
            case LoginCommandType.register.toString():
                if(cmd.params.length !== 3){
                    Logger.Log(`Invalid param count for login command: ${cmd.operation}`);
                    break;
                }
                LoginSystem.GetInstance().SendRegisterReq(cmd.params[0], cmd.params[1], cmd.params[2]);
                break;
            case LoginCommandType.login.toString():
                if(cmd.params.length !== 2){
                    Logger.Log(`Invalid param count for login command: ${cmd.operation}`);
                    break;
                }
                LoginSystem.GetInstance().SendLoginReq(cmd.params[0], cmd.params[1]);
                break;
            default:
                Logger.LogError(`Invalid login scene command: ${cmd.operation}`);
        }
    }
}