#!/usr/bin/env node
const mongoose = require('mongoose');
const R = require('ramda');

const { Schema, Model } = require('../src/models');

//

mongoose.connect('mongodb://localhost:27017/discord', { useNewUrlParser: true });

const database = mongoose.connection;

//

const data = require('./migrate.json');

R.map(it => {
  const log = new Model.Log(it);
  log.save((err, res) => {
    console.log({ err, res });
  });
}, data);
