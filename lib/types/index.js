const $ = require('sanctuary-def');

const K = require('kefir');

const D = require('discord.js');

const def = $.create({
  checkTypes: process.env.NODE_ENV !== 'production',
  env: $.env
});
const Message = $.NullaryType(D.Message);
const Observable = $.NullaryType(K.Observable);
const Property = $.NullaryType(K.Property);
const HandlerFn = $.Function([$.Any, $.Array, Message, Property]);
module.exports = {
  def,
  Message,
  Observable,
  Property,
  HandlerFn
};