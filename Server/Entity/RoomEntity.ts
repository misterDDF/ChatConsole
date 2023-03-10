import { ConstDefine } from "../Common/ConstDefine";
import { RollHintType, RollResult } from "../NetworkCommon/GameMsg";
import { CacheService } from "../Services/CacheService";
import { ChatSystem } from "../System/ChatSystem";
import { PlayerEntity } from "./PlayerEntity";
import { RollerEntity } from "./Roll/RollerEntity";

export class RoomEntity{
    public roomId: number;
    public roomName: string;

    public chatHistory: {account: string, text: string}[] = [];

    private members: PlayerEntity[] = [];
    private rollMembers: PlayerEntity[] = [];
    private emptyTime = 0;  // 房间已闲置的时间
    private roller: RollerEntity;

    public constructor(roomId: number, roomName: string){
        this.roomId = roomId;
        this.roomName = roomName;
        this.roller = new RollerEntity(this);
    }

    public Init(){

    }

    public UpdateRoomState(){
        // 更新房间空置时间
        if(this.members.length <= 0){
            this.emptyTime += ConstDefine.ROOM_UPDATE_TIME;
            if(this.emptyTime >= ConstDefine.ROOM_DISPOSE_TIME){
                this.emptyTime = 0;
                CacheService.GetInstance().DisposeRoom(this.roomId);
            }
        }
        else{
            this.emptyTime = 0;
        }

        this.roller.UpdateRoll();
    }

    public GetMembers(): PlayerEntity[]{
        return this.members
    }

    public ContainsPlayer(player: PlayerEntity): boolean{
        return this.members.indexOf(player)>=0
    }

    public IsRollerStart(): boolean{
        return this.roller.IsRollerStart();
    }

    public AddMember(player: PlayerEntity){
        this.members.push(player);
    }

    public RemoveMember(player: PlayerEntity){
        this.members.splice(this.members.indexOf(player), 1);
    }

    public IsPlayerJoinRoll(player: PlayerEntity){
        return this.rollMembers.indexOf(player) >= 0;
    }

    public AcceptRollReq(player: PlayerEntity){
        if(!this.IsPlayerJoinRoll(player)){
            this.rollMembers.push(player);
            this.roller.AcceptRollReq();
        }
    }

    public BroadcastRollHint(hintType: RollHintType, countDown: number){
        this.members.forEach(member => {
            ChatSystem.GetInstance().SendChatRollHint(member.session, hintType, countDown);
        });
    }

    public BroadcastRollResult(result: RollResult[], top: RollResult){
        this.members.forEach(member => {
            ChatSystem.GetInstance().SendChatRollResult(member.session, result, top);
        });
    }

    public CalRollResult(): boolean{
        let top: RollResult = {account: this.rollMembers[0].account, score: Math.floor(Math.random()*100)};
        let rollResult: RollResult[] = [top];
        let hasTop = true;
        for(let i = 1; i<this.rollMembers.length; i++){
            let val = Math.floor(Math.random()*100);
            if(val > top.score){
                hasTop = true;
                top = {account: this.rollMembers[i].account, score: val};
            }
            else if(val === top.score){
                hasTop = false;
                top = {account: "", score: -1};
            }

            rollResult[i] = {account: this.rollMembers[i].account, score: val};
        }
        this.BroadcastRollResult(rollResult, top);

        this.rollMembers = [];
        return top.account !== "";
    }
}