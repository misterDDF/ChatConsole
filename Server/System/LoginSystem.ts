import { ConstDefine } from "../Common/ConstDefine";
import { ErrorCode } from "../NetworkCommon/ErrorCode";
import { GameMsg, LoginReq, LoginRsp, LogoutRsp, Proto, RegisterReq, RegisterRsp } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { CacheService } from "../Services/CacheService";
import { DataService, PlayerData } from "../Services/DataService";
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
        let playerData: PlayerData = DataService.GetInstance().GetPlayerData(content.account) as PlayerData;
        if(!playerData){
            let errorCode = ErrorCode.LOGIN_ACCOUNT_NOTFOUND.toString();
            let errMsg = `{errorCode: ${errorCode}} Login account not found`;
            let _content: LoginRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_LOGIN_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(content.password !== playerData.password){
            let errorCode = ErrorCode.LOGIN_PASSWORD_WRONG.toString();
            let errMsg = `{errorCode: ${errorCode}} Login password is wrong`;
            let _content: LoginRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_LOGIN_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return
        }

        let _content: LoginRsp = {isSuccess: true};
        let msg: GameMsg = new GameMsg(Proto.PROTO_LOGIN_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);

        // 顶号把之前的session下线掉
        let playerCache = CacheService.GetInstance().GetPlayerCache(content.account);
        if(playerCache){
            let __content: LogoutRsp = {isSuccess: true, isForce: true};
            let _msg: GameMsg = new GameMsg(Proto.PROTO_LOGOUT_RSP, "", __content);
            NetService.GetInstance().SendMsg(playerCache.session, _msg)
            CacheService.GetInstance().RemovePlayerCache(undefined, playerCache.session);
        }
        CacheService.GetInstance().AddPlayerCache(playerData.account, session);
    }

    public HandleRegisterReq(session: XNSession, content: RegisterReq){
        let hasPlayerData: boolean = DataService.GetInstance().HasPlayerData(content.account);
        if(hasPlayerData){
            let errorCode = ErrorCode.REGISTER_ACCOUNT_EXISTED.toString();
            let errMsg = `{errorCode: ${errorCode}} Register account has existed`;
            let _content: RegisterRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_REGISTER_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(content.password !== content.passwordConfirm){
            let errorCode = ErrorCode.REGISTER_PASSWORD_WRONG.toString();
            let errMsg = `{errorCode: ${errorCode}} Register confirm password different from password`;
            let _content: RegisterRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_REGISTER_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(content.password.length > ConstDefine.MAX_PASSWORD_LENGTH){
            let errorCode = ErrorCode.REGISTER_PASSWORD_INVALID.toString();
            let errMsg = `{errorCode: ${errorCode}} Register password is invalid`;
            let _content: RegisterRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_REGISTER_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        let _content: RegisterRsp = {isSuccess: true};
        let msg: GameMsg = new GameMsg(Proto.PROTO_REGISTER_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
        DataService.GetInstance().CreatePlayerData(content.account, content.password);
    }

    public HandleLogoutReq(session: XNSession){
        let _content: LogoutRsp = {isSuccess: true, isForce: false};
        let msg: GameMsg = new GameMsg(Proto.PROTO_LOGOUT_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
        CacheService.GetInstance().RemovePlayerCache(undefined, session);
    }
}