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
    // 登录相关
    PROTO_LOGIN_REQ = 1001,
    PROTO_LOGIN_RSP = 1002,
    PROTO_REGISTER_REQ = 1003,
    PROTO_REGISTER_RSP = 1004,
    PROTO_LOGOUT_REQ = 1005,
    PROTO_LOGOUT_RSP = 1006,

    // 大厅相关
    PROTO_ROOM_CREATE_REQ = 2001,
    PROTO_ROOM_CREATE_RSP = 2002,
    PROTO_ROOM_LIST_REQ = 2003,
    PROTO_ROOM_LIST_RSP = 2004,
    PROTO_ROOM_ENTER_REQ = 2005,
    PROTO_ROOM_ENTER_RSP = 2006,

    // 房间相关

    // GM指令
};

export type ProtoContent = LoginReq | LoginRsp | RegisterReq | RegisterRsp | RoomCreateRsp | RoomListRsp | 
                            RoomEnterReq | RoomEnterRsp | {}

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
    isSuccess: boolean;
    isForce: boolean;    // 是否为顶号导致的登出
}

export interface RoomCreateReq{
    roomName: string;
}

export interface RoomCreateRsp{
    isSuccess: boolean;
    roomId: number;
}

export interface RoomInfo{
    roomId: number,
    roomName: string,
    curMemberCount: number,
}

export interface RoomListRsp{
    isSuccess: boolean;
    roomList: RoomInfo[];
}

export interface RoomEnterReq{
    roomId: number;
}

export interface RoomEnterRsp{
    isSuccess: boolean;
    roomId: number;
}