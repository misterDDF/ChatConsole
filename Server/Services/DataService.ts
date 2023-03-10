import { Logger } from "../Common/Logger";

// 类似数据库管理，只处理长期保存的数据
export class DataService{
    private static instance: DataService;
    public static GetInstance(){
        if(!this.instance){
            this.instance = new DataService();
        }   
        return this.instance;
    }

    public playerDataList: Map<string, PlayerData> = new Map<string, PlayerData>();
    public Init(){
        this.playerDataList.clear();

        // 调试用的gm账号和两个默认普通账号
        this.CreatePlayerData("admin", "123456");
        this.CreatePlayerData("user1", "123456");
        this.CreatePlayerData("user2", "123456");
    }

    public GetPlayerData(account: string): PlayerData | null{
        if(this.HasPlayerData(account)){
            return this.playerDataList.get(account) as PlayerData;
        }
        else{
            Logger.LogError("player not found!");
            return null
        }
    }

    public HasPlayerData(account: string): boolean{
        if(this.playerDataList.get(account)){
            return true;
        }
        return false;
    }

    public CreatePlayerData(account: string, password: string){
        let playerData = {
            account: account,
            password: password,
        };
        this.playerDataList.set(account, playerData);
    }
}

export interface PlayerData{
    account: string,
    password: string,
}