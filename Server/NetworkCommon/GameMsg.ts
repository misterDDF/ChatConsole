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
    PROTO_ROOM_LEAVE_REQ = 2007,
    PROTO_ROOM_LEAVE_RSP = 2008,

    // 房间内相关
    PROTO_CHAT_SAY_REQ = 3001,
    PROTO_CHAT_SAY_RSP = 3002,
    PROTO_CHAT_REPLY_REQ = 3003,
    PROTO_CHAT_REPLY_RSP = 3004,
    PROTO_CHAT_ROLL_REQ = 3005,
    PROTO_CHAT_ROLL_RSP = 3006,
    PROTO_CHAT_ROLL_HINT = 3007,
    PROTO_CHAT_ROLL_RESULT = 3008,

    // GM指令
    PROTO_GM_MEMBERLIST_REQ = 114514,
    PROTO_GM_MEMBERLIST_RSP = 114515,
    PROTO_GM_KICK_REQ = 114516,
    PROTO_GM_KICK_RSP = 114517,
};

export type ProtoContent = LoginReq | LoginRsp | RegisterReq | RegisterRsp | RoomCreateRsp | RoomListRsp | 
                            RoomEnterReq | RoomEnterRsp | RoomLeaveRsp | ChatSayReq | ChatSayRsp | ChatReplyReq |
                            ChatReplyRsp | ChatRollRsp | GMMemberListRsp | GMKickReq | GMKickRsp | ChatRollHint |
                            ChatRollResult | {}

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

export interface RoomLeaveRsp{
    isSuccess: boolean;
    roomId: number;
    isForce: boolean;
}

export interface ChatSayReq{
    text: string;
}

export interface ChatSayRsp{
    text: string;
}

export interface ChatReplyReq{
    line: number;
    text: string;
}

export interface ChatReplyRsp{
    text: string;
}

export interface ChatRollRsp{
    isSuccess: boolean;
}

export enum RollHintType{
    active = 1,
    start = 2,
}

export interface ChatRollHint{
    hintType: RollHintType;
    countDown: number;
}

export interface RollResult{
    account: string,
    score: number,
}

export interface ChatRollResult{
    result: RollResult[];
    top: RollResult,
}

export interface PlayerInfo{
    account: string;
    rollValue: number;
}

export interface GMMemberListRsp{
    isSuccess: boolean;
    memberInfos: PlayerInfo[];
}

export interface GMKickReq{
    account: string;
}

export interface GMKickRsp{
    isSuccess: boolean;
}