import { ConstDefine } from "../../Common/ConstDefine";
import { RollHintType } from "../../NetworkCommon/GameMsg";
import { RoomEntity } from "../RoomEntity";
import { RollState } from "./RollState";
import { RollStateEnd } from "./RollStateEnd";
import { RollStateStart } from "./RollStateStart";

export class RollerEntity{
    public room: RoomEntity;

    private rollState: RollState;
    private rollReq: boolean;    // 房内是否有人请求开Roll
    private gameActiveTime = 0; // 房间游戏激活后倒计时
    private gameStartTime = 0;  // 房间游戏开始前倒计时
    private restartTimes = 0;   // 游戏重开次数

    public constructor(room: RoomEntity){
        this.room = room;
        this.rollReq = false;
        this.rollState = new RollStateEnd(this);
        this.rollState.EnterState();
    }

    public UpdateRoll(){
        this.rollState.ProcessState();
    }

    public ChangeRollState(rollState: RollState){
        this.rollState.ExitState();
        this.rollState = rollState;
        this.rollState.EnterState();
    }

    public GetRollReq(): boolean{
        return this.rollReq;
    }

    public SetRollReq(value: boolean){
        this.rollReq = value;
    }

    public AcceptRollReq(){
        this.rollReq = true;
        this.gameActiveTime = 0;
    }
    
    public GetActiveTime(): number{
        return this.gameActiveTime;
    }

    public SetActiveTime(time: number){
        this.gameActiveTime = time;
    }

    public UpdateActiveTime(){
        // 过秒发提示
        if(Math.floor((this.gameActiveTime + ConstDefine.ROOM_UPDATE_TIME) / 1000) > Math.floor(this.gameActiveTime / 1000)){
            this.room.BroadcastRollHint(RollHintType.active, Math.floor((this.gameActiveTime + ConstDefine.ROOM_UPDATE_TIME) / 1000));
        }
        this.gameActiveTime += ConstDefine.ROOM_UPDATE_TIME;
    }

    public GetStartTime(): number{
        return this.gameStartTime;
    }

    public SetStartTime(time: number){
        this.gameStartTime = time;
    }

    public UpdateStartTime(){
        // 过秒发提示
        if(Math.floor((this.gameStartTime + ConstDefine.ROOM_UPDATE_TIME) / 1000) > Math.floor(this.gameStartTime / 1000)){
            this.room.BroadcastRollHint(RollHintType.start, Math.floor((this.gameStartTime + ConstDefine.ROOM_UPDATE_TIME) / 1000));
        }
        this.gameStartTime += ConstDefine.ROOM_UPDATE_TIME;
    }

    public SetRestartTimes(value: number){
        this.restartTimes = value;
    }

    public IsRollerStart(): boolean{
        return typeof(this.rollState) === typeof(RollStateStart);
    }

    public CalRollResult(){
        if(!this.room.CalRollResult()){
            if(this.restartTimes < ConstDefine.ROLL_RESTART_MAX){
                this.ChangeRollState(new RollStateStart(this))
            }
            this.restartTimes++;
        }
    }
}