exports.commands = [
    "uptime"
];

//a bunch of logic floors
function calcUptime() {
    const time = 0;
    const days = 0;
    const hrs = 0;
    const min = 0;
    const sec = 0;
    const temp = Math.floor(bot.uptime / 1000);
    sec = temp % 60;
    temp = Math.floor(temp/ 60);
    min = temp % 60;
    temp = Math.floor(temp / 60);
    hrs = temp % 24;
    temp = Math.floor(temp / 60);
    days = temp;
    var dayText = "days";
    if (days === 1){
        dayText = "day";
    };
    var upText = "Uptime: `" + days + dayText + hrs + ":" + min + ":" + sec + "`";

    return upText;
};
//the actual command
exports.uptime = {
    name : "uptime",
    desc : "check uptime of the bot",
    longDesc: " Used to check the bot's operation length",
    main : function(bot,msg) {
        bot.sendMessage(msg.calcUptime());
    }
}