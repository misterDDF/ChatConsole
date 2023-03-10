import { CacheService } from "./Services/CacheService";
import { ConfigService } from "./Services/ConfigService";
import { DataService } from "./Services/DataService";
import { NetService } from "./Services/NetService"
import { CenterSystem } from "./System/CenterSystem";
import { ChatSystem } from "./System/ChatSystem";
import { LoginSystem } from "./System/LoginSystem";

ConfigService.GetInstance().Init();
DataService.GetInstance().Init();
CacheService.GetInstance().Init();
NetService.GetInstance().Init();

LoginSystem.GetInstance().Init();
CenterSystem.GetInstance().Init();
ChatSystem.GetInstance().Init();