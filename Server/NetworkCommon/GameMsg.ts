
export class GameMsg{
    public cmd: Proto
    public errMsg: string
    public content: ProtoContent

    public constructor(cmd:Proto, errMsg:string, content: ProtoContent){
        this.cmd = cmd;
        this.errMsg = errMsg;
        this.content = content;
    }
}

export enum Proto {
    PROTO_LOGIN_REQ = 1001,
    PROTO_LOGIN_RSP = 1002,
    PROTO_REGISTER_REQ = 1003,
    PROTO_REGISTER_RSP = 1004,
    PROTO_LOGOUT_REQ = 1005,
    PROTO_LOGOUT_RSP = 1006,
};

export type ProtoContent = LoginReq | LoginRsp | RegisterReq | RegisterRsp | {}

export interface LoginReq {
    account: string;
    password: string;
}

export interface LoginRsp{
    isSuccess: boolean
}

export interface RegisterReq{
    account: string;
    password: string;
    passwordConfirm: string;
}

export interface RegisterRsp{
    isSuccess: boolean
}

export interface LogoutRsp{
    isSuccess: true;
    isForce: boolean;    // 是否为顶号导致的登出
}