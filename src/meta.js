const R = require('ramda');
const L = require('partial.lenses');

// Discord client meta

const parseCommand = R.compose(
  R.drop(1),
  R.match(/(\w+)\s*([\s\S*])/),
  R.trim(),
);

const commandPropL = L.reread(parseCommand);

const commandPrefixL = ['content', commandPropL];

const commandL = L.pick({
  message: L.identity,
  command: [commandPrefixL, L.first],
  commandArgs: [commandPrefixL, L.slice(1, Infinity)],
});

//

module.exports.Discord = {
  commandL,
};
