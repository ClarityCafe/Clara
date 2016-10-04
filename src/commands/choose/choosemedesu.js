exports.commands = [
  "choose",
  ];
  exports.choose = {
      //I would smack Recchan if this doesn't work uwu.
    usage : "<option(minimum of 2)>",
    description : "just like decide, only it selects through a set of given parameters.",
    process : function (bot,msg,suffix){
        const textt = message.slice(8);
        const text = textt.split(';')
        const url = text[ Math.floor(text.length * Math.random()) ];
        bot.sendMessage(msg.channel, msg.author, " I choose.. : " `**` + url + `!**` );
    }
  }
