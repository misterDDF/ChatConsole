import { RollState } from "./RollState";
import { RollStateActive } from "./RollStateActive";

export class RollStateEnd extends RollState{
    public override EnterState(): void {
        super.EnterState();
        this.roller.SetRollReq(false);
        this.roller.SetActiveTime(0);
        this.roller.SetStartTime(0);
    }

    public override ProcessState(): void {
        super.ProcessState();
        if(this.roller.GetRollReq()){
            this.roller.ChangeRollState(new RollStateActive(this.roller));
        }
    }

    public override ExitState(): void {
        super.ExitState();
    }
}