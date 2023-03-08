import { GameMsg, Proto } from "./NetworkCommon/GameMsg"
import { NetService } from "./Services/NetService"

NetService.getInstance().Init()

setTimeout(()=>{
    let msg:GameMsg = new GameMsg(Proto.PROTO_REGISTER_REQ, "", {account:"user", password:"123456", passwordConfirm:"123456"});
    let str = JSON.stringify(msg)
    console.log(str)
    NetService.getInstance().SendMsg(msg)
}, 3000)

setTimeout(()=>{
    let msg:GameMsg = new GameMsg(Proto.PROTO_LOGIN_REQ, "", {account:"user", password:"123456"})
    let str = JSON.stringify(msg)
    console.log(str)
    NetService.getInstance().SendMsg(msg)
}, 6000)

// setTimeout(()=>{
//     let msg:GameMsg = new GameMsg(Proto.PROTO_LOGOUT_REQ, "", {})
//     let str = JSON.stringify(msg)
//     console.log(str)
//     NetService.getInstance().SendMsg(msg)
// }, 9000)

// setTimeout(()=>{
//     let msg:GameMsg = new GameMsg(Proto.PROTO_LOGIN_REQ, "", {account:"user", password:"123456"})
//     let str = JSON.stringify(msg)
//     console.log(str)
//     NetService.getInstance().SendMsg(msg)
// }, 12000)
