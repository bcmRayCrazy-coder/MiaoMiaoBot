import { Structs } from "node-napcat-ts";

export default [
    Structs.face(18),
    Structs.text("你好, 我是喵喵!\n"),
    Structs.face(326),
    Structs.face(54),
    Structs.text(
        " 我可以统计每天/每周群聊的发言数量以及设精情况, 我负责促进群聊设精事业的发展\n",
    ),
    Structs.face(60),
    Structs.text(
        " 喵喵 v2 可加群\n\n支持指令 直接发送即可\n喵喵帮助 - 获取帮助信息\n#信息 - 获取详细信息\n日统计 - 获取本日的群聊统计\n月统计 - 获取本月的群聊统计",
    ),
];
