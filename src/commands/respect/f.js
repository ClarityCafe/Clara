exports.commands = [
  "f"
];

const Promise = require("bluebird");

exports.f = {
  desc: "pay respects",
  fullDesc: "pay respects, you can add something specific to whom/what to pay respects.",
  main: (bot, ctx) => {
    return new Promise((resolve,reject) => {
      if (ctx.suffix.length === 0) {
      ctx.msg.channel.sendMessage(`${ctx.msg.author} has paid respects`).then(() => resolve()).catch(err => reject([err]));
      } else if (ctx.suffix) {
        ctx.msg.channel.sendMessage(`${ctx.msg.author} has paid respects for ${ctx.suffix}`).then(() => resolve()).catch(err => reject([err]));
      }
    });
  }
}