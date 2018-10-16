/**
 * System environment checking
 *
 * Check that the environment is properly set up to ensure
 * operation.
 */
import R from 'ramda';
import V from 'partial.lenses.validation';

const urlRegex = /mongodb:\/\/\w+:\d+/;

const isNonEmpty = R.identity;
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

const { DISCORD_TOKEN, DISCORD_COMMAND_PREFIX, GOOGLE_KEY, MONGODB_URL } = process.env;
console.log({ DISCORD_TOKEN, DISCORD_COMMAND_PREFIX, GOOGLE_KEY, MONGODB_URL });

// V.validate(envRules, process.env);
