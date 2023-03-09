import { Logger } from "../Common/Logger";
import { Command } from "../Services/CommandService";

export enum SceneDefine{
    None = 0,
    Login = 2,
    Center = 4,
    Room = 8,
}

export class SceneBase{
    public sceneDefine: SceneDefine;
    public constructor(){
        this.sceneDefine = SceneDefine.None;
    }

    public Init(){

    }

    public OnEnterScene(){
        
    }

    public OnExitScene(){

    }

    public OnReceiveCommand(cmd: Command){

    }

    protected CheckParamsCount(cmd: Command, countLimit: number): Boolean{
        if(cmd.params.length !== countLimit){
            Logger.Log(`Invalid param count for center command: ${cmd.operation}`);
            return false;
        }
        return true;
    }
}