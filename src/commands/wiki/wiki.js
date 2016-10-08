exports.commands =[
    "wiki"
];

var Wiki = require('wikijs');

exports.wiki = {
    description: "Returns the summary of the first matching search result from Wikipedia",
    usage: "<search term>",
    main: function(bot, ctx) {
        var query = ctx.suffix;
        if (!query || query === '') {
            ctx.msg.channel.sendMessage('Please specify something to search Wikipedia for.');
            return;
        }
        new Wiki().search(query, 1).then(function(data) {
            new Wiki().page(data.results[0]).then(function(page) {
                page.summary().then(function(summary) {
                    var sumText = summary.toString().split('\n');
                    var continuation = function() {
                        var paragraph = sumText.shift();
                        if (paragraph) {
                            ctx.msg.channel.sendMessage(paragraph.continuation);
                        }
                    };
                    continuation();
                });
            });
        }, function(err) {
            ctx.msg.channel.sendMessage(err);
        });
    }
};