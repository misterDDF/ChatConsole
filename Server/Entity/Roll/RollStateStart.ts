import { ConstDefine } from "../../Common/ConstDefine";
import { RollState } from "./RollState";
import { RollStateProcess } from "./RollStateProcess";

export class RollStateStart extends RollState{
    public override EnterState(): void {
        super.EnterState();
        this.roller.SetStartTime(0);
    }    

    public override ProcessState(): void {
        super.ProcessState();
        this.roller.UpdateStartTime();
        if(this.roller.GetStartTime() >= ConstDefine.ROLL_START_TIME){
            this.roller.ChangeRollState(new RollStateProcess(this.roller));
        }
    }

    public override ExitState(): void {
        super.EnterState();
        this.roller.SetStartTime(0);
    }
}