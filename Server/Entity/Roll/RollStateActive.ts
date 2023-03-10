import { ConstDefine } from "../../Common/ConstDefine";
import { RollState } from "./RollState";
import { RollStateStart } from "./RollStateStart";

export class RollStateActive extends RollState{
    public override EnterState(): void {
        super.EnterState();
        this.roller.SetActiveTime(0);
        this.roller.SetRestartTimes(0);
    }

    public override ProcessState(): void {
        super.ProcessState();
        this.roller.UpdateActiveTime();
        if(this.roller.GetActiveTime() >= ConstDefine.ROLL_ACTIVE_TIME){
            this.roller.ChangeRollState(new RollStateStart(this.roller));
        }
    }

    public override ExitState(): void {
        super.ProcessState();
        this.roller.SetActiveTime(0);
    }
}