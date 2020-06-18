const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Dept_employee must have empId, deptId, from_date, to_date

const deptEmployeeFields = {
  empId: Schema.Types.ObjectId,
  deptId: Schema.Types.ObjectId,
  fromDate: Date,
  toDate: Date
};

const deptEmployeeSchema = new Schema(deptEmployeeFields);

const DeptEmployee = mongoose.model('DeptEmployee', deptEmployeeSchema);
if (!DeptEmployee.collection.collection) {
  DeptEmployee.createCollection();
}

module.exports = { DeptEmployee, deptEmployeeSchema };