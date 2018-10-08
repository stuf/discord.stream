const R = require('ramda');
const K = require('kefir');

//

const isProperty = R.is(K.Property);
const isStream = R.is(K.Stream);
const isObservable = R.is(K.Observable);
const isObservableAnd = R.both(isObservable);

//

const toObservable = R.unless(isObservable, K.constant);

const toProperty = R.when(
  isObservableAnd(isStream),
  R.invoker(0, 'toProperty'),
);

const toStream = R.when(
  isObservableAnd(isProperty),
  R.invoker(0, 'changes'),
);

//

const mkError = R.constructN(1, Error);
const mkError2 = R.constructN(2, Error);

//

const curry2 = R.curryN(2);
const curry3 = R.curryN(3);

//

module.exports = {
  isObservable,
  isProperty,
  isStream,
  toObservable,
  toProperty,
  toStream,
  mkError,
  mkError2,
  curry2,
  curry3,
};
