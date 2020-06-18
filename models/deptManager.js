const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Dept_manager must have empId, deptId, from_date, to_date

const deptManagerFields = {
  empId: Schema.Types.ObjectId,
  deptId: Schema.Types.ObjectId,
  fromDate: Date,
  toDate: Date
};

const deptManagerSchema = new Schema(deptManagerFields);

const DeptManager = mongoose.model('DeptManager', deptManagerSchema);
if (!DeptManager.collection.collection) {
  DeptManager.createCollection();
}

module.exports = { DeptManager, deptManagerSchema };