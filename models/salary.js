const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//3 - Salaries must have empId, salary, from_date, to_date
const salaryFields = {
  empId: Schema.Types.ObjectId,
  salary: Number,
  fromDate: Date,
  toDate: Date
};

const salarySchema = new Schema(salaryFields);

const Salary = mongoose.model('Salary', salarySchema);
if (!Salary.collection.collection) {
  Salary.createCollection();
}

module.exports = {Salary, salaryFields};