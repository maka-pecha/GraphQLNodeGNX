const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//2 - Employee must have dni, birth_date, first_name, last_name, gender, hire_date
const employeeFields = {
  dni: Number,
  birthDate: Date,
  name: {
    firstName: String,
    lastName: String,
  },
  gender: String,
  hireDate:  Date
};

const employeeSchema = new Schema(employeeFields);

const Employee = mongoose.model('Employee', employeeSchema);
if (!Employee.collection.collection) {
  Employee.createCollection();
}
module.exports = {Employee, employeeFields};