import { Logger } from "../Common/Logger";
import { CenterScene } from "../Scene/CenterScene";
import { LoginScene } from "../Scene/LoginScene";
import { RoomSceen } from "../Scene/RoomScene";
import { SceneBase, SceneDefine } from "../Scene/SceneBase";
import { Command } from "./CommandService";

export enum SceneEvent {
    error = "error",
    register = "register",
    login = "login",
    logout = "logout",
    room_create = "room_create",
    room_list = "room_list",
    room_enter = "room_enter",
    room_leave = "room_leave",
    chat_say = "chat_say",
    chat_reply = "chat_reply",
    chat_roll = "chat_roll",
    chat_roll_hint = "chat_roll_hint",
    chat_roll_result = "chat_roll_result",
    gm_memberlist = "gm_memberlist",
    gm_kick = "gm_kick",
}

export type EventCB = (params?: any[])=>void;

export class SceneService{
    private static instance: SceneService;
    public static GetInstance(): SceneService{
        if(!this.instance){
            this.instance = new SceneService();
        }
        return this.instance;
    }

    public curScene: SceneBase;
    private eventRegister: Map<SceneEvent, EventCB[]> = new Map<SceneEvent, EventCB[]>();
    private eventQue: {eventId: SceneEvent, params?: any[]}[];
    public constructor(){
        this.curScene = new SceneBase();
        this.eventQue = [];
    }
    public Init(){
        Logger.Log("SceneService init done.");
        setInterval(()=>{
            if(this.eventQue.length !== 0){
                let event = this.eventQue[0];
                let cbList = this.eventRegister.get(event.eventId);
                if(cbList){
                    cbList.forEach(cb => {
                        cb(event.params);
                    });
                }
                this.eventQue.splice(0, 1);
            }
        }, 100);
    }

    public RegisterSceneEvent(eventId: SceneEvent, cb: EventCB){
        if(!this.eventRegister.get(eventId)){
            this.eventRegister.set(eventId, []);
        }
        let cbList = this.eventRegister.get(eventId);
        if(cbList && cbList.indexOf(cb) < 0){
            cbList.push(cb);
        }
    }

    public UnRegisterSceneEvent(eventId: SceneEvent, cb: EventCB){
        if(!this.eventRegister.get(eventId)){
            return;
        }
        let cbList = this.eventRegister.get(eventId) as EventCB[];
        cbList.splice(cbList.indexOf(cb), 1);
    }

    public SendSceneEvent(eventId: SceneEvent, ...params: any){
        this.eventQue.push({eventId: eventId, params: params});
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
                    this.curScene = RoomSceen.GetInstance();
                    this.curScene.OnEnterScene();
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