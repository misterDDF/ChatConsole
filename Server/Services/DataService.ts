
export class DataService{
    private static instance: DataService;
    public static GetInstance(){
        if(!this.instance){
            this.instance = new DataService();
        }   
        return this.instance;
    }

    public playerDataList: {[key:string]:PlayerData} = {};
    public Init(){
        this.playerDataList = {}
    }

    public GetPlayerData(account: string): PlayerData{
        return this.playerDataList[account];
    }
}

export interface PlayerData{
    account: string,
    password: string,
}