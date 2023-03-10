import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { PlayerInfo, RollHintType, RollResult } from "../NetworkCommon/GameMsg";
import { Command } from "../Services/CommandService";
import { SceneEvent, SceneService } from "../Services/SceneService";
import { CenterSystem } from "../System/CenterSystem";
import { ChatSystem } from "../System/ChatSystem";
import { SceneBase, SceneDefine } from "./SceneBase";

enum RoomCommandType{
    none = 'none',
    leave = 'leave',
    say = 'say',
    reply = 'reply',
    roll = 'roll',
    gm_memberlist = 'gm_memberlist',
    gm_kick = 'gm_kick',
}

export class RoomSceen extends SceneBase{
    private static instance: RoomSceen;
    public static GetInstance(): RoomSceen{
        if(!this.instance){
            this.instance = new RoomSceen();
        }
        return this.instance;
    }
    
    public Init(){
        super.Init();
    }

    public OnEnterScene(): void {
        super.OnEnterScene();
        Logger.Log("*****Enter Room Scene*****");

        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.room_leave, this.DisplayRoomLeave);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_say, this.DisplayChatSay);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_reply, this.DisplayChatReply);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_roll, this.DisplayChatRoll);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_roll_hint, this.DisplayChatRollHint);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_roll_result, this.DisplayChatRollResult);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_memtion, this.DisplayChatMemtion);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.gm_memberlist, this.DisplayGMMemberList);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.gm_kick, this.DisplayGMKick);

        console.log("Support command: 1)leave 2)say 3)reply 4)roll")
    }

    public OnExitScene(): void {
        super.OnExitScene();

        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.room_leave, this.DisplayRoomLeave);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.chat_say, this.DisplayChatSay);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.chat_reply, this.DisplayChatReply);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.chat_roll, this.DisplayChatRoll);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.chat_roll_hint, this.DisplayChatRollHint);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.chat_roll_result, this.DisplayChatRollResult);
        SceneService.GetInstance().RegisterSceneEvent(SceneEvent.chat_memtion, this.DisplayChatMemtion);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.gm_memberlist, this.DisplayGMMemberList);
        SceneService.GetInstance().UnRegisterSceneEvent(SceneEvent.gm_kick, this.DisplayGMKick);

        Logger.Log("*****Exit Room Scene*****");
    }

    public OnReceiveCommand(cmd: Command): void {
        super.OnReceiveCommand(cmd);
        switch(cmd.operation){
            case RoomCommandType.leave:
                if(this.CheckParamsCount(cmd, 0)){
                    CenterSystem.GetInstance().SendRoomLeave();
                }
                break;
            case RoomCommandType.say:
                if(this.CheckParamsCount(cmd, 1)){
                    ChatSystem.GetInstance().SendChatSayReq(cmd.params[0]);
                }
                break;
            case RoomCommandType.reply:
                if(this.CheckParamsCount(cmd, 2)){
                    ChatSystem.GetInstance().SendChatReplyReq(Number(cmd.params[0]), cmd.params[1]);
                }
                break;
            case RoomCommandType.roll:
                if(this.CheckParamsCount(cmd, 0)){
                    ChatSystem.GetInstance().SendChatRollReq();
                }
                break;
            case RoomCommandType.gm_memberlist:
                if(this.CheckParamsCount(cmd, 0)){
                    ChatSystem.GetInstance().SendGMMemberListReq();
                }
                break;
            case RoomCommandType.gm_kick:
                if(this.CheckParamsCount(cmd, 1)){
                    ChatSystem.GetInstance().SendGMKickReq(cmd.params[0]);
                }
                break;
            default:
                Logger.LogError(`Invalid room scene command: ${cmd.operation}`);
        }
    }

    public DisplayRoomLeave(params?: any[]){
        let isForce = false;
        if(params){
            isForce = params[0];
        }
        if(isForce){
            console.log("Get kicked by GM, force jump to center scene");
        }
        else{
            console.log("Room leave success, jump to center scene");
        }
        SceneService.GetInstance().SwitchScene(SceneDefine.Center);
    }

    public DisplayChatSay(params?: any[]){
        if(params){
            let text: string = params[0];
            console.log(text);
        }
    }

    public DisplayChatReply(params?: any[]){
        if(params){
            let text: string = params[0];
            console.log(text);
        }
    }

    public DisplayChatRoll(params?: any[]){
        console.log("Join roll game success");
    }

    public DisplayChatRollHint(params?: any[]){
        if(params){
            let hintType: RollHintType = params[0];
            let countDown: number = params[1];

            if(hintType === RollHintType.active){
                let text = `Roll game is activated, you can still join in ${ConstDefine.ROLL_ACTIVE_TIME/1000 - countDown} seconds.`;
                console.log(text);
            }
            else if(hintType === RollHintType.start){
                let text = `Roll game will be started in ${ConstDefine.ROLL_START_TIME/1000 - countDown} seconds.`;
                console.log(text);
            }
            else{
                Logger.LogError("Invalid roll hint type!");
            }
        }
    }

    public DisplayChatRollResult(params?: any[]){
        if(params){
            let rollResult: RollResult[] = params[0];
            let top: RollResult = params[1];

            if(top.account === ""){
                console.log(`No top score, game will restart in ${ConstDefine.ROLL_RESTART_MAX} seconds.`);
            }
            else{
                console.log(`Top roll account: ${top.account}, score: ${top.score}`);
            }
            rollResult.forEach(res => {
                console.log(`account: ${res.account} score: ${res.score}`);
            });
        }
    }

    public DisplayChatMemtion(params?: any[]){
        if(params){
            let account: string = params[0];
            console.log(`${account} has mentioned you.`);
        }
    }

    public DisplayGMMemberList(params?: any[]){
        if(params){
            let playerInfos: PlayerInfo[] = params[0];
            console.log("Show account list in room...");
            playerInfos.forEach(playerInfo => {
                console.log(`${playerInfo.account}`);
            });
        }
    }

    public DisplayGMKick(params?: any[]){
        console.log("GM KICK SUCCESS!");
    }
}