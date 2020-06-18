const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//3 - Titles must have empId, title, from_date, to_date
const titleFields = {
  empId: Schema.Types.ObjectId,
  title: String,
  fromDate: Date,
  toDate: Date
};

const titleSchema = new Schema(titleFields);

const Title = mongoose.model('Title', titleSchema);
if (!Title.collection.collection) {
  Title.createCollection();
}

module.exports = {Title, titleFields};