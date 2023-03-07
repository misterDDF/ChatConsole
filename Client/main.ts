import { GameMsg, Proto } from "./NetworkCommon/GameMsg"
import { MsgParser } from "./NetworkCommon/MsgParser"
import { NetService } from "./Services/NetService"

NetService.getInstance().Init()

let msg:GameMsg = new GameMsg(Proto.PROTO_LOGIN_REQ, "None", {account:"user", password:"123456"})
let str = MsgParser.Stringfy(msg)
console.log(str)

setTimeout(()=>{
    NetService.getInstance().SendMsg(msg)
}, 5000)
