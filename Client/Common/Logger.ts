export enum LogType{
    None = 0,
    Info = 2,
    Warning = 4,
    Error = 8,
}

export class Logger{
    public static Log(message: string, logType: LogType = LogType.Info){
        let logTypeString = LogType[logType]?.toString();
        let curTime = new Date().toString();
        let newLog = `[${logTypeString}] ${message} {Time: ${curTime}}`;
        console.log(newLog);
    }

    public static LogWarrning(message: string){
        Logger.Log(message, LogType.Warning);
    }

    public static LogError(message: string){
        Logger.Log(message, LogType.Error);
    }
}