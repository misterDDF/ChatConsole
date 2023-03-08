import { LoginRsp, LogoutRsp, RegisterRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";

export class LoginSystem{
    private static instance: LoginSystem;
    public static GetInstance(): LoginSystem{
        if(!this.instance){
            this.instance = new LoginSystem();
        }
        return this.instance;
    }

    public Init(){

    }

    public HandleLoginRsp(session: XNSession, content: LoginRsp){
        console.log("login success")
    }

    public HandleRegisterRsp(session: XNSession, content: RegisterRsp){
        console.log("Register success")
    }

    public HandleLogoutRsp(session: XNSession, content: LogoutRsp){
        console.log("Logout success")
    }
}