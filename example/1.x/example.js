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
  	 * @param {String} desc the description of the command
  	 * @param {String} shortDesc a summarized description of your command
  	 * @param {String} usage how your command should be usage if your command requires an argument.
  	 */
  	 constructor(desc, shortDesc, usage=null) {
  	 	desc = 'a sample command ot showcase the proposed 1.x command structure',
  	 	shortDesc = 'meme';
  	 }
  	 
  	 /**
  	  * the main method declaration executes under the class's name, well becase it's the main entrypoint. You get the idea.
  	  */
  	 async main () {
  	 	await ctx.createMessage('Hello world'); //compulsory hello word :mmLol:
  	 }
  	 
  	 /**
  	  * a static declaration is always and foremost, rendered as a seperate command regardless being in the same command class as the subcommands.
  	  */
  	 async static anotherOne () {
  	 	await ctx.createMessage('another one');
  	 }
  	 
  	 /**
  	  * this is a subcommand, anything that isn't named main is executed as a subcommand. so to execute this, you would do <commandName> <subCommandName>.
  	  */
  	 async subCommand() {
  	 	await ctx.createMessage('this is a subcommand');
  	 }
  }
  
  /**
   * always export it using exports.commands NOT module.exports!
   */
   exports.commands = SampleCommand;