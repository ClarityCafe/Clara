/*
  Music Player
  based from chalda/DiscordBot
  
  original codebase by Einadin, modified for owo-whats-this by Capuccino
*/

const YoutubeDL = require('youtube-dl');
const Request = require('request');
const Promise = require('bluebird');

exports.commands = [
	"play",
	"skip",
	"queue",
	"pause",
	"resume",
	"volume"
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
    main : (bot, ctx) => {
        return new Promise ((resolve, reject ) => {
            var wearenumberone =  ctx.msg.guild.channels.filter((v)=>v.type == "voice").filter((v)=>v.members.exists("id",ctx.msg.author.id));
        });
        
    }
}

function wrap(text) {
	return '```\n' + text.replace(/`/g, '`' + String.fromCharCode(8203)) + '\n```';
}