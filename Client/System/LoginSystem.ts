import { Logger } from "../Common/Logger";
import { GameMsg, LoginRsp, LogoutRsp, Proto, RegisterRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { SceneDefine } from "../Scene/SceneBase";
import { NetService } from "../Services/NetService";
import { SceneService } from "../Services/SceneService";

export class LoginSystem{
    private static instance: LoginSystem;
    public static GetInstance(): LoginSystem{
        if(!this.instance){
            this.instance = new LoginSystem();
        }
        return this.instance;
    }

    public Init(){
        Logger.Log('LoginSystem init done')
    }

    public SendRegisterReq(account: string, password: string, passwordConfirm: string){
        let msg: GameMsg = new GameMsg(Proto.PROTO_REGISTER_REQ, "", {account:account, password:password, passwordConfirm: passwordConfirm});
        NetService.GetInstance().SendMsg(msg);
    }

    public SendLoginReq(account: string, password: string){
        let msg: GameMsg = new GameMsg(Proto.PROTO_LOGIN_REQ, "", {account:account, password:password});
        NetService.GetInstance().SendMsg(msg);
    }

    public SendLogoutReq(){
        let msg: GameMsg = new GameMsg(Proto.PROTO_LOGOUT_REQ, "", {});
        NetService.GetInstance().SendMsg(msg);
    }

    public HandleLoginRsp(session: XNSession, content: LoginRsp){
        Logger.Log("Login success");
        SceneService.GetInstance().SwitchScene(SceneDefine.Center);
    }

    public HandleRegisterRsp(session: XNSession, content: RegisterRsp){
        Logger.Log("Register success");
    }

    public HandleLogoutRsp(session: XNSession, content: LogoutRsp){
        Logger.Log("Logout success");
        SceneService.GetInstance().SwitchScene(SceneDefine.Login);
    }
}