import { Logger } from "../Common/Logger";
import { CenterScene } from "../Scene/CenterScene";
import { LoginScene } from "../Scene/LoginScene";
import { SceneBase, SceneDefine } from "../Scene/SceneBase";
import { Command } from "./CommandService";

export class SceneService{
    private static instance: SceneService;
    public static GetInstance(): SceneService{
        if(!this.instance){
            this.instance = new SceneService();
        }
        return this.instance;
    }

    public curScene: SceneBase;
    public constructor(){
        this.curScene = new SceneBase();
    }
    public Init(){
        Logger.Log("SceneService init done.");
    }

    public SwitchScene(toScene?: SceneDefine){
        // 客户端加载第一个场景时
        if(!toScene){
            this.curScene = LoginScene.GetInstance();
            this.curScene.OnEnterScene();
        }
        else{
            this.curScene.OnExitScene();
            switch(toScene){
                case SceneDefine.Login:
                    this.curScene = LoginScene.GetInstance();
                    this.curScene.OnEnterScene();
                    break;
                case SceneDefine.Center:
                    this.curScene = CenterScene.GetInstance();
                    this.curScene.OnEnterScene();
                    break;
                case SceneDefine.Room:
                    break;
                default:
                    Logger.LogError("Scene switch error!");
            }
        }
    }

    public ExecuteCommand(cmd: Command){
        if(this.curScene){
            this.curScene.OnReceiveCommand(cmd);
        }
    }

    public SceneRoot(){
        this.SwitchScene();
    }
}