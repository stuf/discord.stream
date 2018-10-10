/**
 * System environment checking
 *
 * Check that the environment is properly set up to ensure
 * operation.
 */

const R = require('ramda');
const V = require('partial.lenses.validation');

const urlRegex = /mongodb:\/\/\w+:\d+/;

const isNonEmpty = R.identity;
const isLengthWithin = (min, max) => R.compose(R.both(R.gte(min), R.lte(max)), R.length);
const isUrl = R.test(urlRegex);

const isRequired = [isNonEmpty, 'required'];
const isValidUrl = [isUrl, 'invalidUrl'];

const envRules = V.propsOr(V.remove, {
  DISCORD_TOKEN: V.and(
    isRequired,
  ),
  DISCORD_COMMAND_PREFIX: isRequired,
  GOOGLE_KEY: isRequired,
  MONGODB_URL: V.and(
    isRequired,
    isValidUrl,
  ),
});

V.validate(envRules, process.env);
