import { Logger } from '../Common/Logger';
import { SceneService } from './SceneService';

export interface Command{
    operation: string,
    params: string[],
}

export class CommandService{
    private static instance: CommandService;
    public static GetInstance(): CommandService{
        if(!this.instance){
            this.instance = new CommandService();
        }
        return this.instance;
    }

    private curCommand: Command;
    public constructor(){
        this.curCommand = {operation: "", params: []};
    }

    public Init(){
        let stdin = process.openStdin();

        stdin.addListener("data", (input) => {
            this.curCommand = this.BuildCommand(input.toString());
            SceneService.GetInstance().ExecuteCommand(this.curCommand);
        });

        Logger.Log("CommandService init done.")
    }

    public GetCurCommand(): Command{
        return this.curCommand;
    }

    private BuildCommand(inputStr: string): Command{
        let strs: string[] = inputStr.replace(/(\r\n|\n|\r)/gm, "").split(" ");
        strs = strs.filter((s: string)=>{
            return s.trim() !== "";
        })

        let cmd: Command = {
            operation: strs[0],
            params: strs.slice(1, strs.length),
        }
        return cmd;
    }
}