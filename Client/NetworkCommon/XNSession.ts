import * as net from "net"
import { GameMsg } from "./GameMsg";
import { XNSocket } from "./XNSocket";

export class XNSession{
    public xskt: XNSocket;
    private sessionCode: number;

    public constructor(){
        this.sessionCode = -1;
        this.xskt = new XNSocket();
    }

    public SetXSkt(xskt: XNSocket){
        this.xskt = xskt;
        this.xskt.socket?.on('connect', ()=>{
            this.onConnected?.();
        });
        this.xskt.socket?.on('data', (data: Buffer)=>{
            let msg: GameMsg = JSON.parse(data.toString());
            this.onReceiveMsg?.(msg);
        });
        this.xskt.socket?.on('end', ()=>{
            this.onDisconnected?.();
            this.xskt.socket?.destroy();
        })
        this.xskt.socket?.on('error', (errMsg: string)=>{
            this.onError?.(errMsg);
            this.xskt.socket?.destroy();
        });
    }

    public SendMsg(msg: GameMsg){
        if(!this.xskt.isConnected){
            console.log("Socket has not connected yet");
            return;
        }

        let msgJson = JSON.stringify(msg);
        this.xskt.socket?.write(msgJson);
    }

    public onConnected(){
        console.log("Socket connected");
        if(this.xskt.cbCollect.connectCB){
            this.xskt.cbCollect.connectCB(this);
        }

        this.xskt.isConnected = true;
    }

    public onReceiveMsg(msg: GameMsg){
        console.log("Socket received data");
        if(this.xskt.cbCollect.receiveCB){
            this.xskt.cbCollect.receiveCB(this, msg);
        }
    }

    public onDisconnected(){
        console.log("Socket disconnected");
        if(this.xskt.cbCollect.disconnectCB){
            this.xskt.cbCollect.disconnectCB(this);
        }

        // if(this.xskt.isServer){
        //     this.xskt.PopSession(this);
        // }
    }

    public onError(errMsg: string){
        console.log("Socket log error: %s", errMsg);
        if(this.xskt.cbCollect.errorCB){
            this.xskt.cbCollect.errorCB(this, errMsg);
        }

        // if(this.xskt.isServer){
        //     this.xskt.PopSession(this);
        // }
    }

    public GetSessionCode(): number{
        return this.sessionCode;
    }

    public SetSessionCode(code: number){
        this.sessionCode = code;
    }
}