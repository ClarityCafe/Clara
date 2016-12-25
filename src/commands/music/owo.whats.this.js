/*
  Music Player
  based from chalda/DiscordBot
  
  original codebase by Einadin, modified for owo-whats-this by Capuccino
*/

const disco = require('youtube-dl');
const Request = require('request');
const Promise = require('bluebird');

exports.commands = [
    'play',
    'skip',
    'queue',
    'pause',
    'resume',
    'volume'
];

let options = false;
let PREFIX = (options && options.prefix) || 'm.';
let GLOBAL_QUEUE = (options && options.global) || false;
let MAX_QUEUE_SIZE = (options && options.maxQueueSize) || 20;
// Create an object of queues.
let queues = {};
//get queue function w

function getQueue(server) {
    // Check if global queues are enabled.
    if (GLOBAL_QUEUE) server = '_'; // Change to global queue.

    // Return the queue.
    if (!queues[server]) queues[server] = [];
    return queues[server];
}

exports.play = {
    desc: "play a song",
    longDesc: "play a song thru YT (or smth else?)",
    main: (bot, ctx) => {
        return new Promise((resolve, reject) => {
            var summoner = ctx.msg.guilds.channels.filter((v) => v.type === 'voice').filter((v) => v.members.exists('id', ctx.msg.author.id));
            if (summoner.length === 0) {
                ctx.msg.channel.sendMessage('You need to be in a voice channel to summon me!').then(() => {
                    reject([new Error(`user does not meet proper criteria to perform this action`)]).reject(err => ([err]));
                }); if(!suffix){
                    ctx.msg.channel.sendMessage().then(()=> {
                        reject([new Error('Bot has no files to parse and play.')]);
                    }).reject(err => ([err]));
                }
                //get the queue
                const queue = getQueue(ctx.msg.guild.id);

                //check if queue reached permitted size
                if (queue.length >= MAX_QUEUE_SIZE) {
                    return ctx.msg.channel.sendMessage('Maximum queue size has been reached!').then(()=> {
                        reject([new Error('client has reached permitted queue size')]);
                    }).catch(err => ([err]));
                }
                //search info and parse
                ctx.msg.channel.sendMessage('searching... this may take a while...').then(response => {
                    //assume search is keyword-based if http:// wasn't detected
                    if(!suffix.toLowerCase().startsWith('http')) {
                        suffix = 'gvsearch1:' + suffix;
                    }
                    //get info from YTDL
                    disco.getInfo(suffix, ['q', '--no-warnings','--force-ipv4'], (err,info) => {
                        //verify if it exists
                        if(err || info.format.id === undefined || info.format.id.startsWith(0)){
                            return response.edit('this keyword/video link is invalid!');
                        }
                        //queue video if exists 
                        response.edit(`queued ${info.title}`).then((resp) => {
                            queue.push(info);
                            //play if only one element in queue
                            if (queue.length === 1) {
                                executeQueue(client, ctx, queue);
                                resp.delete(1000);
                            }
                        }).catch(err => ([err]));
                    });
                }).catch(err => ([err]));
            }
        });
    }
};

exports.skip = {
    desc: 'skip a playing song',
    longDesc: 'skips a playing song in the voice channel',
    main: (bot,ctx) => {
        const vc = bot.voiceConnections.get(ctx.msg.guild.id);
        if (vc === null) {
            return ctx.msg.channel(`Nee-san! why're you skipping at nothing?`).then(()=>{
                reject([new Error('Client has no songs to skip.')]);
            }).catch(err => ([err]));
            //lessgoparse the queue again like we didn't care uwu
            const queue = getQueue(ctx.msg.guild.id);
            //get it to skip shit
            let toSkip = 1; //skip one song only
            if(!isNaN(ctx.suffix) && parseInt(ctx.suffix) > 0){
                toSkip = parseInt(ctx.suffix);
            }          
            toSkip = Math.min(toSkip,queue.length);
            //skip
            queue.splice(0, toSkip - 1);
            //resume and stop playing(?)this didn't make sense at all lol
            if(voiceConnection.player.dispatcher)voiceConnection.player.dispatcher.resume();
            voiceConnection.player.dispatcher.end();

            ctx.msg.channel.sendMessage(`Skipped ${toSkip}.`).then(()=> resolve()).catch(err => ([err]));
        }
    }
};

exports.queue = {
    desc : 'queue a song without playing it',
    longDesc: 'queues a song, but doesnt play it',
    main : (bot, ctx) => {
        return new Promise((resolve,reject) => {
            //get the queue
            const queue = getQueue(msg.guild.id);
            //get the status
           let queueStatus = 'Stopped';
           const voiceConnection =  bot.voiceConnections.get(ctx.msg.guild.id);
           if(voiceConnection !== null && voiceConnection != undefined){
               queueStatus = voiceConnection.paused ? 'Paused' : 'Playing';

               //send status
               ctx.mg.channel.sendMessage(`Queue Status : ${queueStatus}`).then(() => resolve()).catch(err => ([err]));
           }
        });
    }
}

function executeQueue(bot,ctx,queue) {
    return new Promise((resolve,reject) => {
        const voiceConnection = bot.voiceConnections.get(ctx.msg.guild.id);
        if (queue.length === 0) {
        ctx.msg.channel.sendMessage('Playback finished!').then(() => resolve()).catch (err => ([err]));
           }
           //leave the voice channel
        const voiceConnection = bot.voiceConnections.get(ctx.msg.guild.id);
        if(voiceConnection != null){
            //check if the user is in VC
            var voiceChannel = getAuthorVoiceChannel(ctx.msg);
            if(voiceChannel != null) {
                voiceChannel.join().then(connection => {
                    resolve(connection);
                }).catch(err => ([err]));
            } else {
                //just clear the queue and do nothing
                queue.splice(0, queue.length);
                reject([new Error('User is not onspecified VC, exiting')]);
            }
          } else {
            resolve(voiceConnection);
        }
     })
}

exports.volume = {
    desc : 'adjust the volume',
    longDesc : 'adjust the playback volume of the bot',
    usage : '<volume in percent/dB format>',
    main : (bot, ctx) => {
        return new Promise((resolve,reject) => {
        const voiceConnection = bot.voiceConnections.get(ctx.msg.guild.id);
        if(voiceConnection === null ){
            return ctx.msg.channel.sendMessage('No music to play').then(() => {
                reject([new Error('Cannot change volume, no media file playing.')]);
                }).catch(err => ([err]));
            //set the volume
            if(voiceConnection.player.dispatcher) {
                if(ctx.suffix === '') {
                    var displayVolume = Math.pow(voiceConnection.player.dispatcher, 0.6020600085251697) * 100.0;
                    ctx.msg.channel.sendMessage(`Current volume is ${displayVolume} %`).then(()=> resolve()).catch(err => ([err]))
                } else {
                    if(ctx.suffix.toLowerCase().indexOf('db') === -1){
                        if(ctx.suffix.indexOf('%') === -1){
                            if(ctx.suffix > 1) ctx.suffix/= 100.0;
                            voiceConnection.player.dispatcher.setVolumeLogarithmic(ctx.suffix);
                        } else {
                            var nani = ctx.suffix.split('%')[0];
                            voiceConnection.player.dispatcher.setVolumeLogarithmic(nani/100.0);
                        } else {
                            var value = ctx.suffix.toLowerCase().split('db')[0];
                            voiceConnection.player.dispatcher.setVolumeDecibels(value);
                        }
                    }
                }
            }
        }
    }
  }
}

 function getAuthorVoiceChannel(ctx) {
    return new Promise((resolve,reject) => {
    var voiceChannelArray = ctx.msg.guild.channels.filter((v)=>v.type) == 'voice');
    if(voiceChannelArray.length = 0) return null;
    else return voiceChannelArray[0];
        }
})