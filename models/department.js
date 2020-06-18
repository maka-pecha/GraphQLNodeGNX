const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//5 - Departments must have dept_name
const departmentFields = {
  deptName: String
};

const departmentSchema = new Schema(departmentFields);

const Department = mongoose.model('Department', departmentSchema);
if (!Department.collection.collection) {
  Department.createCollection();
}

module.exports = { Department, departmentFields};