/**
 * @file leetspeak generator nya
 * @author Capuccino
 */
 exports.commands = [
     'leet'
 ];

 const leet = require('leet');
 exports.leet = {
     desc: 'L33tify your message',
     usage: '<message>',
     main(bot, ctx) {
         return new Promise((resolve, reject) => {
             if (!ctx.suffix) {
                 return ctx.createMessage('Provide me a Message to l33tify').then(resolve).catch(reject);
             } else {
                 return ctx.createMessage(leet.convert(ctx.suffix));
             }
         });
     }
 }