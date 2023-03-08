import { Logger } from "../Common/Logger";
import { Command } from "../Services/CommandService";
import { SceneBase } from "./SceneBase";

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

        console.log("Support command: 1)Register 2)Login 3)Exit")
    }

    public OnExitScene(): void {
        super.OnExitScene();
        Logger.Log("*****Exit Room Scene*****");
    }

    public OnReceiveCommand(cmd: Command): void {
        super.OnReceiveCommand(cmd);
    }
}