import { RollState } from "./RollState";
import { RollStateEnd } from "./RollStateEnd";

export class RollStateProcess extends RollState{
    public override EnterState(): void {
        super.EnterState();
    }   
    
    public override ProcessState(): void {
        super.ProcessState();
        this.roller.CalRollResult();
        this.roller.ChangeRollState(new RollStateEnd(this.roller));
    }

    public override ExitState(): void {
        super.ExitState();
    }
}