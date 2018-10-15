const R = require('ramda');
const L = require('partial.lenses');

const { invoke0, construct1 } = require('./shared');

// Generic

const Generic = {};

Generic.readSearchParamsL = L.reread(
  R.compose(R.fromPairs, Array.from, invoke0('entries')),
);

module.exports.Generic = Generic;

// Discord client meta models

/**
 * Function for parsing a string into a list of tokens.
 */
const parseCommand = R.compose(
  R.split(' '),
  R.drop(1),
  R.trim(),
);

const commandPropL = L.reread(parseCommand);

const commandPreL = ['content', commandPropL];

//

const Discord = {};

/**
 * Lens template for turning a discord message into a well-formatted
 * object with the original message, as well as the invoked command
 * and its arguments.
 */
Discord.transformMessageL = L.pick({
  message: L.identity,
  command: [commandPreL, L.first],
  args: [commandPreL, L.slice(1, Infinity)],
});

//

const Youtube = {};

Youtube.basicVideoL = [
  'items',
  L.first,
  L.pick({
    id: 'id',
    url: [
      'id',
      L.normalize(R.concat('https://youtu.be/')),
    ],
    title: [
      'snippet',
      'title',
    ],
    publishedAt: ['snippet', 'publishedAt', L.normalize(construct1(Date))],
    thumbnail: [
      'snippet',
      'thumbnails',
      'maxres',
      'url',
    ],
  }),
];

Youtube.contentDuration = [
  'items',
  L.first,
  'contentDetails',
  'duration',
];

module.exports.Youtube = Youtube;

// Database meta models

//

module.exports.Discord = Discord;
