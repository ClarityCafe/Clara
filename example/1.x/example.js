/* eslint-disable */

// Clara v1.X Command Structure Proposal //

// `Command` and `SubCommand` are defined as children of `global`, so they are accessible without any imports.

class MyCommand {
    constructor(bot) {
        this.bot = bot; // Sets the Clara instance onto the command so we don't need to pass it to commands.
        this.description = 'The best command in the world!';
        this.owner = true;
        this.name = 'overriden' // By default, the command name will be the class name in all lowercase.
        // ...
    }

    // Any methods called `init` will not be included in the command, and will instead be run on command setup.
    // This is equivalent to the current `exports.init = bot => {}`
    // Users can do any asynchronous setup they need in here.
    async init() {
        // ...
    }

    // This is only optional if the command has subcommands, otherwise it is required.
    async main(ctx) {
        // ...
    }

    async subcommand() {
        return new SubCommand({
            description: 'The best subcommand in the world!',
            name: 'foo', // This is optional. By default, the name of the method will be used.
            owner: false, // Will override the owner setting of the parent command if its set.
            name: 'banana' // Once again will default to the name of the method lowercased if omitted.
        }, async ctx => { // This is the actual function
            await ctx.createMessage('I am a banana!');
        });
    }

    // Separate commands can be defined with a `static` method, although it is probably better to specify them in a separate class.
    static async separateCommand() {
        return new Command({
            // Same structure as SubCommand.
        }, async ctx => {
            // ...
        });
    }
}

module.exports = [MyCommand]; // This will have its static's extracted, and be constructed in the command system.