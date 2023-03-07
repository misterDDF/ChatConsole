export class ConfigService{
    private static instance: ConfigService;
    public static GetInstance(): ConfigService{
        if(!this.instance){
            this.instance = new ConfigService();
        }
        return this.instance;
    }

    public Init(){
        
    }
}