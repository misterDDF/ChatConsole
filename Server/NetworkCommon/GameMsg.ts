
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