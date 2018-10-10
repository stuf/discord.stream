const mongoose = require('mongoose');
const { Schema: DBSchema } = mongoose;

//

const Schema = {};

Schema.LogSchema = new DBSchema({
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  videoId: { type: String },
  videoUrl: { type: String },
  videoTitle: { type: String },
  videoPublishedAt: { type: Date },
  videoThumbnailUrl: { type: String },
});

module.exports.Schema = Schema;

//

const Model = {};

Model.Log = mongoose.model('Log', Schema.LogSchema);

module.exports.Model = Model;
