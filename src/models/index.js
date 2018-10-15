const mongoose = require('mongoose');
const { Schema: DBSchema } = mongoose;

//

const Schema = {};

Schema.VideoThumbnailSchema = new DBSchema({
  type: String,
  url: String,
});

Schema.VideoSchema = new DBSchema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  publishedAt: { type: Date },
  length: { type: Number },
  etag: { type: String },
  player: { type: String },
  thumbnail: { type: String },
});

Schema.LogSchema = new DBSchema({
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  logType: { type: String },
  video: Schema.VideoSchema,
});

module.exports.Schema = Schema;

//

const Model = {};

Model.Log = mongoose.model('Log', Schema.LogSchema);
Model.Video = mongoose.model('Video', Schema.VideoSchema);
Model.VideoThumbnail = mongoose.model('VideoThumbnail', Schema.VideoThumbnailSchema);

module.exports.Model = Model;
