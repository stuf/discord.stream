const mongoose = require('mongoose'); //
// #region Schemas


const Schema = {};
Schema.log = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  markedAt: {
    type: Date
  }
});
Schema.user = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  discriminant: {
    type: String,
    required: true
  },
  tag: {
    type: String
  }
}); // #endregion
//
// #region Models

const Model = {};
Model.log = mongoose.model('Log', Schema.log);
Model.user = mongoose.model('User', Schema.user); // #endregion

module.exports = {
  Schema,
  Model
};