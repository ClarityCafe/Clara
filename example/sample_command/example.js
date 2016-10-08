exports.commands = [
    //add a keyword for your command here
    "example"
];

//the proper format for your command is
exports.example = {
    desc: "", //the description for this command-specific help
    longDesc: "", //used by the <prefix>help command.
    main: 
    //process goes here. a Helloworld example has been given
    // bot = the bot (always append this)
    // msg = the keyword initializer
    // suffix = for a non-argument userentry
    //args = command-specific args
    function(bot, ctx) {
        ctx.msg.channel,sendMessage('Hello world');
    }
}