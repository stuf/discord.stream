const U = require('karet.util');
const R = require('ramda');
const K = require('kefir');

const { construct2 } = require('../shared');
const { HelpError } = require('../classes');

//

const content = {
  log: require('./help/log.md'),
};

//

const error = {};

/**
 * @param {String} cmd
 * @returns {HelpError}
 */
error.invalidCommand = construct2(HelpError)('No help found for given command');

/**
 * @type {Function}
 * @param {String} cmd
 * @returns {K.Property<HelpError>}
 */
error.invalidCommand$ = R.pipe(methods.error.invalidCommand, K.constantError);

module.exports.error = error;

//

const methods = {};

/**
 * @private
 * @param {String} command
 * @returns {K.Observable}
 */
methods._getCommandHelp = R.pipe(R.prop(R.__, content), K.constant);

//

/**
 * @param {String} command
 * @returns {K.Observable}
 */
methods.getHelp = command => U.thru(
  command,
  U.flatMapLatest(R.ifElse(
    R.has(R.__, content),
    methods._getCommandHelp,
    methods.error.invalidCommand$,
  ))
);

//

module.exports.methods = methods;
