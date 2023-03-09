import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { RoomInfo } from "../NetworkCommon/GameMsg";
import { XNSession } from "../NetworkCommon/XNSession";

// 类似线上服务器内存，只处理线上的临时数据
export class CacheService{
    private static instance: CacheService;
    public static GetInstance(): CacheService{
        if(!this.instance){
            this.instance = new CacheService();
        }
        return this.instance;
    }

    private playerCacheList: Map<string, PlayerCache> = new Map<string, PlayerCache>();
    private roomCacheList: Map<number, RoomCache> = new Map<number, RoomCache>();
    public Init(){
        this.playerCacheList.clear();
        this.roomCacheList.clear();
    }

    public GetPlayerCache(account?: string, session?: XNSession): PlayerCache | undefined{
        if(account){
            return this.playerCacheList.get(account);
        }

        for (const [key, value] of this.playerCacheList) {
            if(value.session === session){
                return this.playerCacheList.get(value.account);
            }
        }
    }

    public AddPlayerCache(account: string, session: XNSession){
        if(!this.playerCacheList.get(account)){
            let cache: PlayerCache = {
                account: account,
                isOnline: true,
                isAdmin: account === "admin",
                session: session,
                roomId: -1,
            };
            this.playerCacheList.set(account, cache);
        }
        else{
            Logger.LogError("Player cache add failed!")
        }
    }

    public UpdatePlayerCache(account: string, roomId?: number){
        let player = this.playerCacheList.get(account);
        if(player){
            player.roomId = roomId ? roomId : player.roomId;
        }
    }

    public RemovePlayerCache(account?: string, session?: XNSession){
        if(account){
            let player = this.playerCacheList.get(account);
            if(player){
                if(player.roomId >= 0){
                    this.RemoveMemeberFromRoom(player.roomId, player);
                }
                this.playerCacheList.delete(account);
            }
        }
        else if(session){
            for (const [account, player] of this.playerCacheList) {
                if(player.session === session){
                    if(player.roomId >= 0){
                        this.RemoveMemeberFromRoom(player.roomId, player);
                    }
                    this.playerCacheList.delete(player.account);
                    break;
                }
            }
        }
    }

    public GetRoomCache(id: number): RoomCache | undefined{
        if(id >= 0){
            return this.roomCacheList.get(id);
        }
    }

    public CreateRoomCache(roomName: string, player: PlayerCache): number{
        let roomId = -1;
        if(this.roomCacheList.size >= ConstDefine.MAX_ROOM_COUNT){
            roomId = -1;
            return roomId;
        }

        for(let i = 0; i<ConstDefine.MAX_ROOM_COUNT; i++){
            if(!this.roomCacheList.get(i)){
                roomId = i;
                let room: RoomCache = {
                    roomId: i,
                    roomName: roomName,
                    state: {roomId: i, members: []},
                    emptyTime: 0,
                };
                this.roomCacheList.set(i, room);
                this.AddMemeberToRoom(roomId, player);
                break;
            }
        }

        return roomId;
    }

    public AddMemeberToRoom(roomId: number, player: PlayerCache){
        let room = this.GetRoomCache(roomId);
        if(room && room.state.members.indexOf(player)<0){
            room.state.members.push(player);
            player.roomId = roomId;
        }
    }

    public RemoveMemeberFromRoom(roomId: number, player: PlayerCache){
        let room = this.GetRoomCache(roomId);
        if(room && room.state.members.indexOf(player)>=0){
            room.state.members.splice(room.state.members.indexOf(player));
        }
    }

    public GetRoomList(): RoomInfo[]{
        let roomList: RoomInfo[] = [];
        this.roomCacheList.forEach(room => {
            roomList.push({roomId: room.roomId, roomName: room.roomName, curMemberCount: room.state.members.length});
        });
        return roomList;
    }

    public UpdateAllRoomCache(){
        let disposeIdList: number[] = [];
        this.roomCacheList.forEach(room => {
            if(room.state.members.length <= 0){
                room.emptyTime += ConstDefine.ROOM_UPDATE_TIME;
                if(room.emptyTime >= ConstDefine.ROOME_DISPOSE_TIME){
                    disposeIdList.push(room.roomId);
                }
            }
            else{
                room.emptyTime = 0;
            }
        });
        
        disposeIdList.forEach(roomId => {
            this.roomCacheList.delete(roomId);
        });
    }
}

// 在线玩家的定义
export interface PlayerCache{
    account: string,
    isOnline: boolean,
    isAdmin: boolean,
    session: XNSession,
    roomId: number,
}

// 大厅房间的定义
export interface RoomCache{
    roomId: number,
    roomName: string,
    state: RoomState,
    emptyTime: number,  // 房间已闲置的时间
}

// 房间内部状态定义
export interface RoomState{
    roomId: number,
    members: PlayerCache[],
}