const $ = require('sanctuary-def');

const {
  def,
  Message,
  Property,
  HandlerFn
} = require('../types');

const handle_ = (command, args, message) => {};

const handle = def('validate')({})([$.Any, $.Array, Message, Property])(handle_);