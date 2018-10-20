@{%
const shared = require('./shared');
const moo = require('moo');

const S = Object.assign({}, shared);

const lexer = moo.compile({
  PREFIX: '!',
  QUOTE: ['"', '\''],
  WS: /[ \t]+/,
  NUM: /[0-9]+/,
  WORD: /[a-z]+/,
  URL: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/,
});
%}

@lexer lexer

INPUT         -> PREFIX
                 VALID
                 {% ([_, result]) => ({ command: result[0], args: result.slice(1)}) %}

PREFIX        -> %PREFIX {% S.nothing %}
WS            -> %WS {% S.nothing %}

MWS           -> WS | null {% S.nothing %}

VALID         -> ( MWS (WORD | NUMBER | URL) {% S.takeI(1) %}
                 | MWS (WORD | NUMBER | URL) VALID {% S.P(S.drop(1), S.select) %}
                 ) {% S.select %}

URL           -> %URL {% S.head %}
WORD          -> %WORD {% S.head %}
NUMBER        -> %NUM {% S.head %}
