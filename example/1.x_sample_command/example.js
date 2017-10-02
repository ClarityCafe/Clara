/**
 * @file A sample command to show the basic structure of commands
 * @author Capuccino
 * @author Ovyerus
 */

 /**
  * Unlike the old command system, the 1.x features a class based system for easier making of commands.
  * this is a example command class that the holder executes.
  */
  class SampleCommand {
      /**
       * This is where you define the command's metadata
       * @param {String} desc the long description for your command
       * @param {String} shortDesc the summarized description of your command
       * @param {String} usage the usage for your command. Enclosing it in <> means its a mandatory argument, enclosing it in () means it's optional
       */
      constructor(desc, shortDesc, usage) {
          this.desc = 'a sample command to showcase the new 1.x command',
          this.shortDesc = 'a sample command',
          this.usage = '<example mandatory usage>';
      }

      /**
       * this is the main command of the command class
       */
      async main() {
          await ctx.createMessage('This is a sample command');
      }

      /**
       * This is a subcommand, subcommands are usually executed by defining the main command's name then the subcommand.
       */
      async nya() {
          await ctx.createMessage('nya');
      }

      /**
       * A static defenition means it's still related to the main command but it's rendered as a seperate command.
       * @static
       */
      static async kon() {
          await ctx.createMessage('Mart is gya'); //im bored ok.
      }
  }

  /**
   * always end your command with exports.command, NOT module.exports
   */
  exports.command = SampleCommand;