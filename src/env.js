const R = require('ramda');
const V = require('partial.lenses.validation');

const isNonEmpty = R.identity;

const isRequired = [isNonEmpty, 'required'];

const envRules = V.propsOr(V.remove, {
  DISCORD_TOKEN: V.and(
    isRequired,
  ),
  DISCORD_COMMAND_PREFIX: V.and(
    isRequired,
  ),
  GOOGLE_KEY: V.and(
    isRequired,
  ),
});

V.validate(envRules, process.env);
