// * Report - Inform the admin of someone's bad actions(?)
// * or is it?
// *
// * Early April Fools joke by Capuccino


exports.commands = [
    'report'
];

exports.report = {
    desc: 'seeing harmful behaviour,report it!',
    longDesc: 'report someone',
    usage : '<Mention> <Message>',
    main : (bot,ctx) => {
        return new Promise((resolve,reject) => {
            if (ctx.msg.user.mention || ctx.suffix.length === 0) {
                ctx.msg.channel.createMessage('Mention a user you want to report and put your reason in able to report!').then(() => {
                    reject(new Error('No User and Reason Specified'));
                }).catch(err => reject(err));
            } else if (ctx.msg.user.mention || ctx.suffix) {
                ctx.msg.channel.createMessage('This has been reported to the proper authorities, Thanks for your cooperation!').then(() => {
                    logger.info(`${ctx.msg.author} fell for it!`);
                    resolve();
                }).catch(err => reject(err));
            }
        });
    }
};