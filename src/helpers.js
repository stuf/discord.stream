/**
 * Helpers
 *
 * `shared.js` contains a number of useful utility functions that
 * are generalized to not operate on any singular type of specialized
 * data structure.
 *
 * Anything that can be classified as a utility, but that should be able to
 * be used in any context but still on a specific data structure should be
 * placed into helpers instead.
 */
const L = require('partial.lenses');

//

const Discord = { Message: {} };

Discord.Message.serialize = L.get(
  L.props(
    'author',
    'content',
    'createdAt',
    'createdTimestamp',
    'deletable',
    'deleted',
    'editable',
    'editedAt',
    'editedTimestamp',
    'guild',
    'hit',
    'id',
    'nonce',
    'pinnable',
    'pinned',
    'tts',
    'type',
    'url',
    'webhookID',
  ),
);

//

module.exports.Discord = Discord;
