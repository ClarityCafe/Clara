/**
 * @file this is an example file of the proposed 1.x command system
 * @author Capuccino
 */
  
/**
   * unlike the 0.x system, we use a class based approach to our commands, we parse the class name as the name of the commands
   * due to the limitation of the 0.x command system of not being able to use declarations with numeric numbers
   */
class SampleCommand {
    /**
  	 * this is where the command metadata is set
  	 */
    constructor() {
        this.metadata = {
            desc: 'A sample command to showcase the new class-based command structure for Clara 1.x',
            shortDesc: 'a sample command, duh',
            usage: '<none>'
        };
    }
	
    /**
	* the main method declaration executes under the class's name, well becase it's the main entrypoint. You get the idea.
	* @param {Eris.Message} ctx the Context class parameter
  	*/
    async main(ctx) {
        await ctx.createMessage('Hello world'); //compulsory hello word :mmLol:
    }
 
    /**
	* a static declaration is always and foremost, rendered as a seperate command regardless being in the same command class as the subcommands.
	* @param {Eris.Message} ctx the Context class parameter
  	*/  
    static async anotherOne(ctx) {
        await ctx.createMessage('another one');
    }
	
    /**
	* this is a subcommand, anything that isn't named main is executed as a subcommand. so to execute this, you would do <commandName> <subCommandName>.
	* @param {Eris.Message} ctx the Context class parameter
	* @param {Eris.Client} bot the Bot class parameter
  	*/
    async subCommand(ctx, bot) {
        await ctx.createMessage('this is a subcommand');
        bot.nya();
    }
}
  
/**
* always export it using exports.commands NOT module.exports!
*/
exports.commands = SampleCommand;