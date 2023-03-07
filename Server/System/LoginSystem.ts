import { ErrorCode } from "../NetworkCommon/ErrorCode";
import { GameMsg, LoginReq, LoginRsp, Proto, RegisterReq } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { DataService } from "../Services/DataService";
import { NetService } from "../Services/NetService";

export class LoginSystem{
    private static instance: LoginSystem;
    public static GetInstance(){
        if(!this.instance){
            this.instance = new LoginSystem();
        }
        return this.instance;
    }

    public Init(){

    }

    public HandleLoginReq(session: XNSession, content: LoginReq){
        if(!DataService.GetInstance().GetPlayerData(content.account)){
            let errorCode = ErrorCode.LOGIN_ACCOUNT_NOTFOUND.toString();
            let errMsg = "{$errorCode: } Login account not found";
            let _content: LoginRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_LOGIN_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        let _content: LoginRsp = {isSuccess: true};
        let msg: GameMsg = new GameMsg(Proto.PROTO_LOGIN_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
    }

    public HandleRegisterReq(content: RegisterReq){

    }
}