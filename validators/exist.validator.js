const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const DepartmentModel = require('../models/department').Department;
const EmployeeModel = require('../models/employee').Employee;

const EmployeeMustToExist ={
  validate: async function(typeName, originalObject, materializedObject) {
    const EmployeeFound = await EmployeeModel.findById(materializedObject.empId) ;

    if (!EmployeeFound) {
      throw new EmployeeHasToExistError(typeName, 'The employee must to exist');
    }
  }};
class EmployeeHasToExistError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'EmployeeHasToExistError');
  }
}

const DepartmentMustToExist ={
  validate: async function(typeName, originalObject, materializedObject) {
    const DepartmentFound = await DepartmentModel.findById(materializedObject.deptId);

    if (!DepartmentFound) {
      throw new DepartmentHasToExistError(typeName, 'The department must to exist');
    }
  }};
class DepartmentHasToExistError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'DepartmentHasToExistError');
  }
}

module.exports ={
  EmployeeMustToExist,
  DepartmentMustToExist
};