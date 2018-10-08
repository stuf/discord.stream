const R = require('ramda');
const K = require('kefir');
const L = require('partial.lenses');

//

// #region Ramda basic
const curry2 = R.curryN(2);
const curry3 = R.curryN(3);

const construct0 = R.constructN(0);
const construct1 = R.constructN(1);
const construct2 = R.constructN(2);

const invoke0 = R.invoker(0);
const invoke1 = R.invoker(1);
// #endregion

// #region Built-in constructors
const mkError1 = construct1(Error);
const mkError2 = construct2(Error);
// #endregion

// #region Kefir
const isProperty = R.is(K.Property);
const isStream = R.is(K.Stream);
const isObservable = R.is(K.Observable);
const isObservableAnd = R.both(isObservable);

//

const toObservable = R.unless(isObservable, K.constant);

const toProperty = R.when(
  isObservableAnd(isStream),
  invoke0('toProperty'),
);

const toStream = R.when(
  isObservableAnd(isProperty),
  invoke0('changes'),
);
// #endregion

// #region partial.lenses
const lGet = curry2(L.get);
const lRemove = curry2(L.remove);
const lSet = curry3(L.set);
const lModify = curry3(L.modify);
const lTransform = curry2(L.transform);
// #endregion

//

module.exports = {
  curry2,
  curry3,
  invoke0,
  invoke1,
  construct0,
  construct1,
  construct2,

  // Builtins
  mkError1,
  mkError2,

  // Kefir
  isStream,
  isProperty,
  isObservable,
  isObservableAnd,

  toStream,
  toProperty,
  toObservable,

  // partial.lenses
  lGet,
  lRemove,
  lSet,
  lModify,
  lTransform,
};
