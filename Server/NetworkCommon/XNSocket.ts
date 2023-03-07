import * as net from "net"
import { GameMsg } from "./GameMsg";
import { XNSession } from "./XNSession";

let MAX_SESSION_NUM = 100;

export class XNSocket{
    public port = 0;
    public server: net.Server | null;
    public socket: net.Socket | null;
    public session: XNSession | null;
    public sessioinList: {[key:number]: XNSession}
    public isServer: boolean;
    public isConnected: boolean;
    public receivedCB: ((msg: GameMsg)=>void) | undefined;

    public constructor(){
        this.port = 0;
        this.server = null;
        this.socket = null;
        this.session = null;
        this.sessioinList = [];
        this.isServer = false;
        this.isConnected = false;
        this.receivedCB = undefined;
    }

    public StartAsServer(port: number, receivedCB?: (msg: GameMsg)=>void){
        this.server = net.createServer((connection: net.Socket)=>{
            let session = new XNSession();
            let clientSkt = new XNSocket();
            clientSkt.port = this.port;
            clientSkt.socket = connection;
            clientSkt.isServer = true;
            clientSkt.receivedCB = receivedCB;
            clientSkt.session = session;
            session.SetXSkt(clientSkt);
            this.PushSession(session);
        });

        this.server.listen(port, ()=>{
            console.log('Server is listening at port:%d', port);
        })
        this.isServer = true;
    }

    public StartAsClient(port: number, receivedCB?: (msg: GameMsg)=>void){
        this.port = port;
        this.session = new XNSession(); 
        this.socket = net.connect({port: this.port});
        this.session.SetXSkt(this);
        this.isServer = false;
    }

    public PopSession(session: XNSession) {
        if(!this.isServer){
            console.log("Only server can pop session by code");
            return null;
        }

        for(let i = 0; i<MAX_SESSION_NUM; i++){
            if(this.sessioinList[i] === session){
                console.log("Session pop success, session code: %d", i);
                return;
            }
        }
        console.log("Session not found, pop failed");
    }

    public PushSession(session: XNSession){
        if(!this.isServer){
            console.log("Only server can push session by code");
            return;
        }
        for(let i = 0; i<MAX_SESSION_NUM; i++){
            if(!this.sessioinList[i]){
                this.sessioinList[i] = session;
                console.log("Server push new session, session code: %d", i);
                return;
            }
        }      

        console.log("Session build failed, session list is full");
    }
}