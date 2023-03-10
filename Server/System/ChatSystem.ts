import { ErrorCode } from "../NetworkCommon/ErrorCode";
import { ChatReplyReq, ChatReplyRsp, ChatSayReq, ChatSayRsp, GameMsg, GMKickReq, GMKickRsp, GMMemberListRsp, PlayerInfo, Proto } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { CacheService, PlayerCache, RoomCache } from "../Services/CacheService";
import { NetService } from "../Services/NetService";
import { CenterSystem } from "./CenterSystem";

export class ChatSystem{
    private static instance: ChatSystem;
    public static GetInstance(): ChatSystem{
        if(!this.instance){
            this.instance = new ChatSystem();
        }
        return this.instance;
    }

    public Init(){

    }

    public HandleChatSayReq(session: XNSession, content: ChatSayReq){
        let player = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, say text failed`;
            let _content: ChatSayRsp = {text: ""};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_SAY_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let room = CacheService.GetInstance().GetRoomCache(player.roomId);
        if(!room){
            let errorCode = ErrorCode.CHAT_ROOM_NOTFOUND.toString();
            let errMsg = `{errorCode: ${errorCode}} Room not found, say text failed`;
            let _content: ChatSayRsp = {text: ""};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_SAY_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        room.state.members.forEach(member => {
            let text = `[line_${member.curLineIndex - member.firstLineIndex + 1}]@${player?.account}: ${content.text}`;
            let _content: ChatSayRsp = {text: text};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_SAY_RSP, "", _content);
            member.curLineIndex++;
            NetService.GetInstance().SendMsg(member.session, msg); 
        });
        room.chatHistory.push({account: player?.account, text: content.text});
    }

    public HandleChatReplyReq(session: XNSession, content: ChatReplyReq){
        let player = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, reply text failed`;
            let _content: ChatReplyRsp = {text: ""};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_REPLY_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let room = CacheService.GetInstance().GetRoomCache(player.roomId);
        if(!room){
            let errorCode = ErrorCode.CHAT_ROOM_NOTFOUND.toString();
            let errMsg = `{errorCode: ${errorCode}} Room not found, reply text failed`;
            let _content: ChatReplyRsp = {text: ""};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_REPLY_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(content.line<1 || content.line>player.curLineIndex){
            let errorCode = ErrorCode.CHAT_REPLYLINE_INVALID.toString();
            let errMsg = `{errorCode: ${console.error()}} Chat reply line is invalid`;
            let _content: ChatReplyRsp = {text: ""};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_REPLY_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        room.state.members.forEach(member => {
            let preChat = (room as RoomCache).chatHistory[(player as PlayerCache).firstLineIndex + content.line];
            let replyText = `Reply to >>> @${preChat.account}: ${preChat.text}`;
            let text = `[line_${member.curLineIndex + 1}]@${player?.account}: ${content.text}`;
            let _content: ChatSayRsp = {text: replyText + "\n" + text};
            let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_REPLY_RSP, "", _content);
            member.curLineIndex++;
            NetService.GetInstance().SendMsg(member.session, msg); 
        });
        room.chatHistory.push({account: player?.account, text: content.text});
    }

    public HandleChatRollReq(session: XNSession){

    }

    public HandleGMMemberListReq(session: XNSession){
        let player = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, member list acquire denied`;
            let _content: GMMemberListRsp = {isSuccess: false, memberInfos: []};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_MEMBERLIST_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(!player.isAdmin){
            let errorCode = ErrorCode.GM_ACCOUNT_ILLEGAL.toString();
            let errMsg = `{errorCode: ${errorCode}} Account is not admin, member list acquire denied`;
            let _content: GMMemberListRsp = {isSuccess: false, memberInfos: []};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_MEMBERLIST_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let room = CacheService.GetInstance().GetRoomCache(player.roomId);
        if(!room){
            let errorCode = ErrorCode.CHAT_ROOM_NOTFOUND.toString();
            let errMsg = `{errorCode: ${errorCode}} Room not found, member list acquire denied`;
            let _content: GMMemberListRsp = {isSuccess: false, memberInfos: []};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_MEMBERLIST_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }

        let memberInfos: PlayerInfo[] = [];
        room.state.members.forEach(member => {
            memberInfos.push({account: member.account});
        });
        let _content: GMMemberListRsp = {isSuccess: true, memberInfos: memberInfos};
        let msg: GameMsg = new GameMsg(Proto.PROTO_GM_MEMBERLIST_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
    }

    public HandleGMKickReq(session: XNSession, content: GMKickReq){
        let player = CacheService.GetInstance().GetPlayerCache(undefined, session);
        if(!player){
            let errorCode = ErrorCode.ROOM_ACCOUNT_NOEXIST.toString();
            let errMsg = `{errorCode: ${errorCode}} Player not found, member kick failed`;
            let _content: GMKickRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_KICK_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        if(!player.isAdmin){
            let errorCode = ErrorCode.GM_ACCOUNT_ILLEGAL.toString();
            let errMsg = `{errorCode: ${errorCode}} Account is not admin, member kick failed`;
            let _content: GMKickRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_KICK_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let room = CacheService.GetInstance().GetRoomCache(player.roomId);
        if(!room){
            let errorCode = ErrorCode.CHAT_ROOM_NOTFOUND.toString();
            let errMsg = `{errorCode: ${errorCode}} Room not found, member kick failed`;
            let _content: GMKickRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_KICK_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        let kickPlayer = CacheService.GetInstance().GetPlayerCache(content.account);
        if(!kickPlayer || room.state.members.indexOf(kickPlayer)<0){
            let errorCode = ErrorCode.CHAT_ROOM_NOTFOUND.toString();
            let errMsg = `{errorCode: ${errorCode}} Kick member account not found, member kick failed`;
            let _content: GMKickRsp = {isSuccess: false};
            let msg: GameMsg = new GameMsg(Proto.PROTO_GM_KICK_RSP, errMsg, _content);
            NetService.GetInstance().SendMsg(session, msg);
            return;
        }
        
        let _content: GMKickRsp = {isSuccess: true};
        let msg: GameMsg = new GameMsg(Proto.PROTO_GM_KICK_RSP, "", _content);
        NetService.GetInstance().SendMsg(session, msg);
        CenterSystem.GetInstance().SendRoomLeaveRsp(kickPlayer.session, kickPlayer, true);
    }
}