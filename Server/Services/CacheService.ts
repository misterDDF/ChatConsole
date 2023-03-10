import { ConstDefine } from "../Common/ConstDefine";
import { Logger } from "../Common/Logger";
import { PlayerEntity } from "../Entity/PlayerEntity";
import { RoomEntity } from "../Entity/RoomEntity";
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

    private playerList: Map<string, PlayerEntity> = new Map<string, PlayerEntity>();
    private roomList: Map<number, RoomEntity> = new Map<number, RoomEntity>();
    private disposeRoomIdList: number[] = [];
    public Init(){
        this.playerList.clear();
        this.roomList.clear();
    }

    public GetPlayerEntity(account?: string, session?: XNSession): PlayerEntity | undefined{
        if(account){
            return this.playerList.get(account);
        }

        for (const [key, value] of this.playerList) {
            if(value.session === session){
                return this.playerList.get(value.account);
            }
        }
    }

    public AddPlayerEntity(account: string, session: XNSession){
        if(!this.playerList.get(account)){
            let player = new PlayerEntity(account, session);
            this.playerList.set(account, player);
        }
        else{
            Logger.LogError("Player cache add failed!")
        }
    }

    public UpdatePlayerEntity(account: string, roomId?: number){
        let player = this.playerList.get(account);
        if(player){
            player.roomId = roomId ? roomId : player.roomId;
        }
    }

    public RemovePlayerEntity(account?: string, session?: XNSession){
        if(account){
            let player = this.playerList.get(account);
            if(player){
                if(player.roomId >= 0){
                    this.RemoveMemeberFromRoom(player.roomId, player);
                }
                this.playerList.delete(account);
            }
        }
        else if(session){
            for (const [account, player] of this.playerList) {
                if(player.session === session){
                    if(player.roomId >= 0){
                        this.RemoveMemeberFromRoom(player.roomId, player);
                    }
                    this.playerList.delete(player.account);
                    break;
                }
            }
        }
    }

    public GetRoomCache(id: number): RoomEntity | undefined{
        if(id >= 0){
            return this.roomList.get(id);
        }
    }

    public CreateRoomCache(roomName: string, player: PlayerEntity): number{
        let roomId = -1;
        if(this.roomList.size >= ConstDefine.MAX_ROOM_COUNT){
            roomId = -1;
            return roomId;
        }

        for(let i = 0; i<ConstDefine.MAX_ROOM_COUNT; i++){
            if(!this.roomList.get(i)){
                roomId = i;
                let room = new RoomEntity(roomId, roomName);
                this.roomList.set(i, room);
                break;
            }
        }

        return roomId;
    }

    public AddMemeberToRoom(roomId: number, player: PlayerEntity){
        let room = this.GetRoomCache(roomId);
        if(room && !room.ContainsPlayer(player)){
            player.roomId = roomId;
            player.firstLineIndex = 0;
            player.curLineIndex = 0;
            room.AddMember(player);
        }
    }

    public RemoveMemeberFromRoom(roomId: number, player: PlayerEntity){
        let room = this.GetRoomCache(roomId);
        if(room?.ContainsPlayer(player)){
            player.roomId = -1;
            player.firstLineIndex = 0;
            player.curLineIndex = 0;
            room.RemoveMember(player);
        }
    }

    public GetRoomList(): RoomInfo[]{
        let roomList: RoomInfo[] = [];
        this.roomList.forEach(room => {
            roomList.push({roomId: room.roomId, roomName: room.roomName, curMemberCount: room.GetMembers().length});
        });
        return roomList;
    }

    public UpdateAllRoomCache(){
        this.roomList.forEach(room => {
            room.UpdateRoomState();
        });
        
        // 待销毁的房间在一次update后统一清理
        this.disposeRoomIdList.forEach(roomId => {
            this.roomList.delete(roomId);
        });
    }

    public DisposeRoom(roomId: number){
        this.disposeRoomIdList.push(roomId);
    }
}
