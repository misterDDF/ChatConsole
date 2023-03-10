export enum ErrorCode{
    // 登录错误码
    LOGIN_ACCOUNT_NOTFOUND = 10001, // 用户未注册
    LOGIN_PASSWORD_WRONG = 10002,   // 登录密码错误

    // 注册错误码
    REGISTER_ACCOUNT_EXISTED = 11001,   // 用户已注册
    REGISTER_PASSWORD_WRONG = 11002,    // 密码不符合规则
    REGISTER_PASSWORD_INVALID = 11003,  // 注册输入两次密码不一样

    // 大厅错误码
    ROOM_CREATE_MAXCOUNT = 12001,   // 大厅房间数已满
    ROOM_MEMBER_MAXCOUNT = 12002,   // 房间满员
    ROOM_ID_NOTEXIST = 12003,   // 房间不存在
    ROOM_ACCOUNT_NOEXIST = 12004, // 加入房间的玩家账号不存在

    // 聊天错误码
    CHAT_ROOM_NOTFOUND = 13001, // 聊天房间不存在
    CHAT_REPLYLINE_INVALID = 13002, // 回复行号不存在
    CHAT_ROLL_STARTED = 13003,    // 房间内游戏已经开始
    CHAT_ROLL_JOINED = 13004,   // 玩家已经加入了游戏

    // GM命令错误码
    GM_ACCOUNT_ILLEGAL = 114514,    // 当前账号不是GM账号
    GM_KICKACCOUNT_NOTFOUND = 114515,   // 被踢账号不存在
}