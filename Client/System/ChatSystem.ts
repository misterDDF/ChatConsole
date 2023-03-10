import { ChatMemtion, ChatReplyReq, ChatReplyRsp, ChatRollHint, ChatRollResult, ChatRollRsp, ChatSayReq, ChatSayRsp, GameMsg, GMKickReq, GMKickRsp, GMMemberListRsp, Proto } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";
import { NetService } from "../Services/NetService";
import { SceneEvent, SceneService } from "../Services/SceneService";

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

    public SendChatSayReq(text: string){
        let content: ChatSayReq = {text: text};
        let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_SAY_REQ, "", content);
        NetService.GetInstance().SendMsg(msg);
    }

    public SendChatReplyReq(line: number, text: string){
        let content: ChatReplyReq = {line: line, text: text};
        let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_REPLY_REQ, "" , content);
        NetService.GetInstance().SendMsg(msg);
    }

    public SendChatRollReq(){
        let msg: GameMsg = new GameMsg(Proto.PROTO_CHAT_ROLL_REQ, "", {});
        NetService.GetInstance().SendMsg(msg);
    }

    public SendGMMemberListReq(){
        let msg: GameMsg = new GameMsg(Proto.PROTO_GM_MEMBERLIST_REQ, "", {});
        NetService.GetInstance().SendMsg(msg);
    }

    public SendGMKickReq(account: string){
        let content: GMKickReq = {account: account};
        let msg: GameMsg = new GameMsg(Proto.PROTO_GM_KICK_REQ, "", content);
        NetService.GetInstance().SendMsg(msg);
    }

    public HandleChatSayRsp(session: XNSession, content: ChatSayRsp){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.chat_say, content.text);
    }

    public HandleChatReplyRsp(session: XNSession, content: ChatReplyRsp){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.chat_reply, content.text);
    }

    public HandleChatRollRsp(session: XNSession, content: ChatRollRsp){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.chat_roll);
    }

    public HandleChatRollHint(session: XNSession, content: ChatRollHint){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.chat_roll_hint, content.hintType, content.countDown);
    }

    public HandleChatRollResult(session: XNSession, content: ChatRollResult){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.chat_roll_result, content.result, content.top);
    }

    public HandleChatMemtion(session: XNSession, content: ChatMemtion){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.chat_memtion, content.account);
    }

    public HandleGMMemberListRsp(session: XNSession, content: GMMemberListRsp){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.gm_memberlist, content.memberInfos);
    }

    public HandleGMKickRsp(session: XNSession, content: GMKickRsp){
        SceneService.GetInstance().SendSceneEvent(SceneEvent.gm_kick);
    }
}