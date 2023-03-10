export class ConstDefine{
    public static DEFAULT_PORT = 80;    // socket默认端口

    public static MAX_SESSION_NUM = 10; // 最大会话数

    public static MAX_PASSWORD_LENGTH = 10; // 用户密码长度

    public static MAX_ROOM_COUNT = 100;    // 大厅中最大房间数

    public static MAX_MEMBER_COUNT = 10;    // 房间中最大用户数

    public static ROOM_UPDATE_TIME = 100;   // 空房间检查间隔
    public static ROOM_DISPOSE_TIME = 10000;  // 空房间销毁延时

    public static EVENTQUE_UPDATE_TIME = 10;   // scene事件消息队列更新时间

    public static ROLL_ACTIVE_TIME = 10000; // 房间游戏激活倒计时
    public static ROLL_START_TIME = 5000;   // 房间游戏开始倒计时
    public static ROLL_RESTART_MAX = 5; // 最大roll点游戏重开次数
}