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
const R = require('ramda');

const L = require('partial.lenses');

const {
  parseDec
} = require('./shared'); //
// #region Discord


const Discord = {
  Message: {}
};
Discord.Message.serialize = L.get(L.props('author', 'content', 'createdAt', 'createdTimestamp', 'deletable', 'deleted', 'editable', 'editedAt', 'editedTimestamp', 'guild', 'hit', 'id', 'nonce', 'pinnable', 'pinned', 'tts', 'type', 'url', 'webhookID'));
module.exports.Discord = Discord; // #endregion
// #region Youtube

const Youtube = {};
const durationPatterns = [[/PT/, ''], [/M/, ':'], [/S/, '']];
const multipliers = [1, 60, 24]; //

Youtube.getDuration = R.pipe(R.reduce((rs, [p, t]) => R.replace(p, t, rs), R.__, durationPatterns), R.split(':'), R.map(parseDec), R.reverse, R.zip(multipliers), R.map(R.apply(R.multiply)), R.reduce(R.add, 0)); // #endregion
//

module.exports.Youtube = Youtube;