# Creating Commands

This will use the [ping](../../src/commands/ping/ping.js) command for examples.

Commands *need* a `package.json` to validate them, otherwise the command loader will skip over them in the init process.

At the top of the command file, have a multi-line comment with the command file name and a short description of the file on the top line, followed by an empty line and then the contributor(s) of the command.

```js
/*
 * ping.js - Simple command used to check ping time.
 * 
 * Contributed by Capuccino and Ovyerus.
 */
```

Next, define all the modules used in the whole command file, as well as any variables that are going to be used in the commands that don"t need/cant be put directly in the functions. Make sure to always include `bluebird` as `Promise` as this is used in all commands for async and is faster than standard ES6 Promises.

```js
const Promise = require("bluebird");
... 
```

After that comes `exports.commands` which is an array used to define the commands to expose to the command loader.

```js
exports.commands = [
    "ping"
];
```

Now comes the part where you actually define your commands.
Commands are standard JavaScript objects with at most, 5 properties.
They must go under `exports` with their desired name, eg. `exports.ping`

- `desc`: **Mandatory** [String] - Short overview of what the command does. Displayed in the help command. Try to keep a more in-depth description in the `fullDesc` property.
- `fullDesc`: **Optional** [String] - More in-depth description of what the command does. Shown when user does `help [command]`. If not specified, will use `desc`.
- `adminOnly`: **Optional** [Boolean] - Restricts the command to people who are admins of the bot.
- `usage`: **Optional** [String] - Shows arguments to pass to the command. `<argument>` designates a required argument. `[argument]` designates an optional argument. Make sure to reject the Promise if the argument(s) are required and not all required arguments are given.
- `main`: **Required** [Function] - The main function for the command. Is given two arguments, `bot` and `ctx`. More about the `ctx` object is [below](#ctx-object). Must return a Promise, otherwise the bot will crash when it runs the command.

If you reject the Promise with the error in an array, it will not send an error message to the channel. Can be used when catching send message errors, or if you wish to have your own message instead of the default one.

```js
exports.ping = {
    desc: "Ping!",
    longDesc: "Ping the bot and check it"s latency.",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendMessage("Pong!").then(m => {
                m.edit(`Pong! \`${m.timestamp - ctx.msg.timestamp}ms\``).then(() => resolve()).catch(err => reject([err]));
            }).catch(err => reject([err]));
        });
    }
}
```

In the end, the whole code (for this example) should look like this.

```js
/*
 * ping.js - Simple command used to check ping time.
 * 
 * Contributed by Capuccino, Ovyerus.
 */

const Promise = require("bluebird");

exports.commands = [
    "ping"
];

exports.ping = {
    desc: "Ping!",
    longDesc: "Ping the bot and check it"s latency.",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            ctx.msg.channel.sendMessage("Pong!").then(m => {
                m.edit(`Pong! \`${m.timestamp - ctx.msg.timestamp}ms\``).then(() => resolve()).catch(err => reject([err]));
            }).catch(err => reject([err]));
        });
    }
}
```

# CTX Object

`ctx` stands for "context"

This object is a standard JavaScript object with 5 properties.
- `msg`: [[Discord.JS Message Object]](https://discord.js.org/#!/docs/tag/master/class/Message) - Standard Discord.JS message object.
- `args`: [Array] - Contains every word that the user entered after the command. If the user did not have anything, will just be empty.
- `cmd`: [String] - The name of the command used. Passed in case it is needed for some reason.
- `suffix`: [String] - All the words in `args` but joined together in one string with spaces.
- `guildBot`: [[Discord.JS GuildMember Object](https://discord.js.org/#!/docs/tag/master/class/GuildMember)|Null] - The member object of the bot for the message guild. Returns `null` if it is a DM.