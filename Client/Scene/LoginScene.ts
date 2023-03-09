import { Logger } from "../Common/Logger";
import { Command } from "../Services/CommandService";
import { SceneEvent, SceneService } from "../Services/SceneService";
import { LoginSystem } from "../System/LoginSystem";
import { SceneBase, SceneDefine } from "./SceneBase";

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

        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.register, this.DisplayRegister);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.login, this.DisplayLogin);

        console.log("Support command: 1)register 2)login")
    }

    public override OnExitScene(): void {
        super.OnExitScene();
        
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.register, this.DisplayRegister);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.login, this.DisplayLogin);

        Logger.Log("*****Exit Login Scene*****");
    }

    public override OnReceiveCommand(cmd: Command): void {
        super.OnReceiveCommand(cmd);
        switch(cmd.operation){
            case LoginCommandType.register.toString():
                if(this.CheckParamsCount(cmd, 3)){
                    LoginSystem.GetInstance().SendRegisterReq(cmd.params[0], cmd.params[1], cmd.params[2]);
                }
                break;
            case LoginCommandType.login.toString():
                if(this.CheckParamsCount(cmd, 2)){
                    LoginSystem.GetInstance().SendLoginReq(cmd.params[0], cmd.params[1]);
                }
                break;
            default:
                Logger.LogError(`Invalid login scene command: ${cmd.operation}`);
        }
    }

    public DisplayRegister(params?: any[]){
        console.log("Register success, now enter account and password to login.");
    }

    public DisplayLogin(params?: any[]){
        console.log("Login success, now jump to center scene.")
        SceneService.GetInstance().SwitchScene(SceneDefine.Center);
    }
}