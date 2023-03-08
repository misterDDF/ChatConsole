import { Logger } from "../Common/Logger";


export class CenterSystem{
    private static instance: CenterSystem;
    public static GetInstance(): CenterSystem{
        if(!this.instance){
            this.instance = new CenterSystem();
        }
        return this.instance;
    }

    public Init(){
        Logger.Log("CenterSystem init done.");
    }
}