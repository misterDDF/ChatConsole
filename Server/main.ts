import { ConfigService } from "./Services/ConfigService";
import { DataService } from "./Services/DataService";
import { NetService } from "./Services/NetService"
import { CenterSystem } from "./System/CenterSystem";
import { LoginSystem } from "./System/LoginSystem";

ConfigService.GetInstance().Init();
DataService.GetInstance().Init();
NetService.GetInstance().Init();

LoginSystem.GetInstance().Init();
CenterSystem.GetInstance().Init();