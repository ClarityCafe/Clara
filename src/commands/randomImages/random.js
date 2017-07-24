/**
 * @file Random Cat, dog and birb posters
 * @author Capuccino
 */

 exports.commands = [
     'random',
     'chirp',
     'woof',
     'meow'
 ];

 function randomBlock() {
     return {
         title: 'Random animal image spewer',
         description: 'Sends out a random birb, dog or cat image.',
         fields: [
             {name: 'woof', value: 'Sends out a random doggo picture', inline: true},
             {name: 'chirp', value: 'Sends out a random birb picture', inline: true},
             {name: 'meow', value: 'Sends out a random cat picture', inline: true}
         ]
     };
 }
 exports.loadAsSubcommands = true;

 exports.main = {
     desc: 'Spews out a random image or a birb, a dog or a cat',
     usage: 'random <woof | meow | chirp>',
     main(bot, ctx) {
         return new Promise((resolve, reject) => {
             ctx.createMessage({embed: randomBlock}).then(resolve).catch(reject);
         });
     }
 };
 exports.chirp = {
     main(bot, ctx) {
         return new Promise((resolve, reject) => {
             ctx.channel.sendTyping();
             got('https://random.birb.pw/tweet').then(res => {
                 return ctx.createMessage({embed: {
                     title: 'tweet-title',
                     image: {url: `https://random.birb.pw/img/${res.body}`},
                     footer: {text: 'tweet-credits'}
                 }});
             }).then(resolve).catch(reject);
         });
     }
 };
 exports.meow = {
     main(bot, ctx) {
         ctx.channel.sendTyping();
         return new Promise((resolve, reject) => {
             got('http://random.cat/meow').then(res => {
                 let kitty = JSON.parse(res.body).file;
                 return ctx.createMessage({embed: {
                     title: 'Nyaaa~',
                     image: {url: kitty},
                     footer: {text: 'Powered by random.cat'}
                 }});
             }).then(resolve).catch(reject);
         });
     }
 };
 exports.woof = {
     main(bot, ctx) {
         return new Promise((resolve, reject) => {
             ctx.channel.sendTyping();
             got('http://random.dog/woof').then(res => {
                 return ctx.createMessage({embed: {
                     title: 'Have a random doggo!',
                     image: {url: `http://random.dog/${res.body}`},
                     footer: {text: 'Powered by Random.dog'}
                 }});
             }).then(resolve).catch(reject);
         });
     }
 };