const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner : {type : mongoose.Types.ObjectId, required: true, ref: 'Owner' },
  members: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  messages: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Message' }],
  isPrivate : {type: Boolean},
});

module.exports = mongoose.model('Group', schema);
