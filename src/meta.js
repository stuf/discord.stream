const R = require('ramda');
const L = require('partial.lenses');

// Discord client meta models

/**
 * Function for parsing a string into a list of tokens.
 */
const parseCommand = R.compose(
  R.drop(1),
  R.match(/(\w+)\s*([\s\S*])/),
  R.trim(),
);

const commandPropL = L.reread(parseCommand);

const commandPrefixL = ['content', commandPropL];

/**
 * Lens template for turning a discord message into a well-formatted
 * object with the original message, as well as the invoked command
 * and its arguments.
 */
const commandL = L.pick({
  message: L.identity,
  command: [commandPrefixL, L.first],
  commandArgs: [commandPrefixL, L.slice(1, Infinity)],
});

// Database meta models

//

module.exports.Discord = {
  commandL,
};
