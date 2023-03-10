import { NetService } from "./Services/NetService"
import { LoginSystem } from "./System/LoginSystem"
import { Logger } from "./Common/Logger"
import { CommandService } from "./Services/CommandService"
import { SceneEvent, SceneService } from "./Services/SceneService"
import { CenterSystem } from "./System/CenterSystem"
import { ChatSystem } from "./System/ChatSystem"

Logger.Log("Init Services...");
NetService.GetInstance().Init();
CommandService.GetInstance().Init();
SceneService.GetInstance().Init();

Logger.Log("Init Systems...");
LoginSystem.GetInstance().Init();
CenterSystem.GetInstance().Init();
ChatSystem.GetInstance().Init();

SceneService.GetInstance().SceneRoot();