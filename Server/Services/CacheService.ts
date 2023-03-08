import { XNSession } from "../NetworkCommon/XNSession";
import { DataService, PlayerData } from "./DataService";

// 类似线上服务器内存，只处理线上的临时数据
export class CacheService{
    private static instance: CacheService;
    public static GetInstance(): CacheService{
        if(!this.instance){
            this.instance = new CacheService();
        }
        return this.instance;
    }

    public playerCacheList: Map<string, PlayerCache> = new Map<string, PlayerCache>();
    public Init(){
        this.playerCacheList.clear();
    }

    public GetPlayerCache(account?: string, session?: XNSession): PlayerCache | undefined{
        if(account){
            return this.playerCacheList.get(account);
        }
    }

    public AddPlayerCache(account: string, session: XNSession){
        if(!this.playerCacheList.get(account)){
            let cache: PlayerCache = {
                account: account,
                isOnline: true,
                session: session,
                playerData: DataService.GetInstance().GetPlayerData(account) as PlayerData,
            };
            this.playerCacheList.set(account, cache);
        }
        else{
            console.log("Player cache add failed")
        }
    }

    public RemovePlayerCache(account?: string, session?: XNSession){
        if(account){
            if(this.playerCacheList.get(account)){
                this.playerCacheList.delete(account);
            }
        }
        else if(session){
            for (const [key, value] of this.playerCacheList) {
                if(value.session === session){
                    this.playerCacheList.delete(value.account);
                    break;
                }
            }
        }
    }
}

// 在线玩家的状态集合
export interface PlayerCache{
    account: string,
    isOnline: boolean,
    session: XNSession,
    playerData: PlayerData,
}