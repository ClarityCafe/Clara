/* eslint-disable */

// `Command` and `SubCommand` are defined as children of `global`, so they are accessible without any imports.

class MyCommand {
    constructor(bot) {
        this.bot = bot; // Sets the Clara instance onto the command so we don't need to pass it to commands.
        this.description = 'The best command in the world!';
        this.owner = true;
        // ...
    }

    // Any methods called `init` will not be included in the command, and will instead be run on command setup.
    // This is equivalent to the current `exports.init = bot => {}`
    // Users can do any asynchronous setup they need in here.
    async init() {
        // ...
    }

    async subcommand() {
        return new SubCommand({
            description: 'The best subcommand in the world!',
            name: 'foo', // This is optional. By default, the name of the method will be used.
            owner: false // Will override the owner setting of the parent command if its set.
        }, async ctx => { // This is the actual function
            await ctx.createMessage('I am a banana!');
        });
    }

    static async separateCommand() {
        return new Command({
            // Same structure as SubCommand.
        }, async ctx => {
            // ...
        });
    }
}

module.exports = [MyCommand]; // This will have its static's extracted, and be constructed in the command system.