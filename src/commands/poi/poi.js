// * Poi
// * Poi?
// * POI!!!!!???
// * [Poi intensifies]
// * -Capuccino

exports.commands = [
  'poi'
];

exports.poi = {
  desc: 'Poi? POI!? POOOOOOOOOOIIIIIIII!!!!',
  main: (bot,ctx) => {
    return new Promise((resolve,reject) => {
      ctx.msg.channel.createMessage('Poi!').then(() => resolve).catch(reject);
    });
  }
}