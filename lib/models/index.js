const mongoose = require('mongoose');

const R = require('ramda');

const {
  Schema: DBSchema
} = mongoose; //

/**
 * @type {Function}
 * @param {Object} definition
 * @returns {mongoose.Schema}
 */

const mkSchema1 = R.constructN(1, DBSchema); //
// #region Schema

const Schema = {};
/**
 * Schema representing a tag
 */

Schema.TagSchema = mkSchema1({
  tag: {
    type: String,
    unique: true
  }
});
/**
 * Logged video
 */

Schema.VideoSchema = mkSchema1({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  publishedAt: {
    type: Date
  },
  length: {
    type: Number
  },
  etag: {
    type: String
  },
  player: {
    type: String
  },
  thumbnail: {
    type: String
  }
});
Schema.LogSchema = mkSchema1({
  user: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  logType: {
    type: String,
    enum: ['scrim', 'tryout', 'misc']
  },
  video: Schema.VideoSchema
}); // Bot-related

Schema.BotChannelSchema = mkSchema1({
  id: {
    type: String
  },
  channelType: {
    type: String,
    enum: ['dm', 'group', 'text', 'voice', 'category']
  }
}); // Discord-related

Schema.DiscordUserSchema = mkSchema1({
  id: {
    type: String
  },
  username: {
    type: String
  },
  tag: {
    type: String
  },
  createdAt: {
    type: Date
  },
  discriminator: {
    type: String
  }
}); // #endregion
// #region Models

const Model = {};
Model.Log = mongoose.model('Log', Schema.LogSchema);
Model.Video = mongoose.model('Video', Schema.VideoSchema);
Model.BotChannel = mongoose.model('BotChannel', Schema.BotChannelSchema); // #endregion

module.exports = {
  Model,
  Schema
};