import { Register } from "ts-node";
import { GameMsg, LoginReq, LoginRsp, Proto, ProtoContent, RegisterReq, RegisterRsp } from "./GameMsg";

let paramSpliter = "||";
let contentSpliter = "@?@";

export class MsgParser{
    public static Stringfy(msg: GameMsg):string {
        let str = "";
        str = str.concat(msg.cmd.toString(), paramSpliter, msg.errMsg, paramSpliter);
        let contentStr = "";
        let contentParams: string[] = []
        switch(msg.cmd){
            case Proto.PROTO_LOGIN_REQ:
                contentParams = [(msg.content as LoginReq).account, (msg.content as LoginReq).password]
                contentStr = contentStr.concat(contentParams.join(contentSpliter))
                break;
            case Proto.PROTO_LOGIN_RSP:
                contentParams = [(msg.content as LoginRsp).isSuccess ? "true":"false"]
                contentStr = contentStr.concat(contentParams.join(contentSpliter))
                break;
            case Proto.PROTO_REGISTER_REQ:
                contentParams = [(msg.content as RegisterReq).account, (msg.content as RegisterReq).password, (msg.content as RegisterReq).passwordConfirm]
                contentStr = contentStr.concat(contentParams.join(contentSpliter))
                break;
            case Proto.PROTO_REGISTER_RSP:
                contentParams = [(msg.content as RegisterRsp).isSuccess ? "true":"false"]
                contentStr = contentStr.concat(contentParams.join(contentSpliter))
                break;
            default:
                contentStr = " ";
        }
        str = str.concat(contentStr)
        return str;
    }

    public static UnStringfy(msg: String):GameMsg {
        let params: string[] = msg.split(paramSpliter);
        let cmd: Proto = Proto[params[0] as keyof typeof Proto]
        let errMsg: string = params[1]
        let contentStr = params[2]

        let content: ProtoContent;
        switch(cmd){
            case Proto.PROTO_LOGIN_REQ:
                params = contentStr.split(contentSpliter);
                content = {account: params[0], password: params[1]};
                break;
            case Proto.PROTO_LOGIN_RSP:
                params = contentStr.split(contentSpliter);
                content = {isSuccess: params[0] === "true"?true:false};
                break;
            case Proto.PROTO_REGISTER_REQ:
                params = contentStr.split(contentSpliter);
                content = {account: params[0], password: params[1], passwordConfirm: params[2]};
                break;
            case Proto.PROTO_REGISTER_RSP:
                params = contentStr.split(contentSpliter);
                content = {isSuccess: params[0] === "true"?true:false};
                break;
            default:
                content = {};
        }
        return new GameMsg(cmd, errMsg, content);
    }
}