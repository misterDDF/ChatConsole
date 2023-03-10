import { XNSession } from "../NetworkCommon/XNSession";

export class PlayerEntity{
    public account: string;
    public session: XNSession;
    public isAdmin: boolean;
    public roomId = 0; // 玩家所在房间
    public firstLineIndex = 0; // 玩家进入聊天室的第一行聊天行号
    public curLineIndex = 0;  // 玩家所在房间最新的聊天行号

    public constructor(account: string, session: XNSession){
        this.account = account;
        this.session = session;
        this.isAdmin = this.account === "admin";
    }
}