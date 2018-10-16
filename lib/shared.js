const R = require('ramda');

const K = require('kefir');

const L = require('partial.lenses');

const {
  URL
} = require('url'); //


function _defineName(fn, value) {
  return Object.defineProperty(fn, 'name', {
    value,
    configurable: true
  });
}

const defineName = (() => {
  try {
    return _defineName(_defineName, 'defineName');
  } catch (_) {
    // eslint-disable-next-line
    return (fn, _) => fn;
  }
})(); // eslint-disable-next-line


const nameFns = L.modify([L.entries], ([k, v]) => [k, defineName(v, k)]); //

const id = R.identity;

function try$(fn) {
  try {
    return K.constant(fn());
  } catch (e) {
    return K.constantError(e);
  }
}

function tryConst$(fn) {
  return () => try$(fn);
} // #region Ramda basic


const curry2 = R.curryN(2);
const curry3 = R.curryN(3);
const construct0 = R.constructN(0);
const construct1 = R.constructN(1);
const construct2 = R.constructN(2);
const invoke0 = R.invoker(0);
const invoke1 = R.invoker(1); // #endregion
// #region Functional utilities

const bimap = curry3((f, g, xs) => [f(xs[0]), g(xs[1])]);
const first = curry2((f, xs) => bimap(f, id, xs));
const second = curry2((g, xs) => bimap(id, g, xs));

const toBi = x => [x, x];

const toBifunctor = toBi;
const B = {
  bimap,
  first,
  second,
  toBi,
  toBifunctor
}; // #endregion
// #region Methods

const get1 = invoke1('get'); // #endregion
// #region Basic

const mkError1 = construct1(Error);
const mkError2 = construct2(Error);
const parseNum = curry2(parseInt);
const parseDec = parseNum(R.__, 10); // #endregion
// #region Node.js

const mkUrl1 = construct1(URL); // #endregion
// #region Kefir

const isProperty = R.is(K.Property);
const isStream = R.is(K.Stream);
const isObservable = R.is(K.Observable);
const isObservableAnd = R.both(isObservable); //

const toObservable = R.unless(isObservable, K.constant);
const toProperty = R.when(isObservableAnd(isStream), invoke0('toProperty'));
const toStream = R.when(isObservableAnd(isProperty), invoke0('changes')); // #endregion
// #region partial.lenses

const lGet = curry2(L.get);
const lRemove = curry2(L.remove);
const lSet = curry3(L.set);
const lModify = curry3(L.modify);
const lTransform = curry2(L.transform); // #endregion
// #region Utility

const show = R.tap(x => console.log(x));

const showWith = (...args) => R.tap(x => console.log(...args, x)); // #endregion
//


module.exports = {
  defineName,
  try$,
  tryConst$,
  curry2,
  curry3,
  invoke0,
  invoke1,
  construct0,
  construct1,
  construct2,
  // Functional utilities
  B,
  // Methods
  get1,
  // Builtins
  mkError1,
  mkError2,
  parseNum,
  parseDec,
  // Node.js
  mkUrl1,
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
  // Utility
  show,
  showWith
};