const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const DeptEmployeeModel = require('../models/deptEmployee').DeptEmployee;
const TitleModel = require('../models/title').Title;

const CantBeSameEmployeeWithTwoTitlesDeptEmployee = {
  validate: async function(typeName, originalObject, materializedObject) {
    const DeptEmployeeFound = await DeptEmployeeModel.findOne({ 'empId': materializedObject.empId });
    const TitleFound = await TitleModel.findOne({ 'empId': materializedObject.empId });
    let DepartmentFound = null;
    if (DeptEmployeeFound){
      DepartmentFound = await DeptEmployeeModel.findOne({'deptId': DeptEmployeeFound.deptId });
    }
    if (DepartmentFound &&
        TitleFound &&
        TitleFound._id !== materializedObject.id) {
      throw new CantBeSameEmployeeWithTwoTitlesDeptEmployeeError(typeName, 'The same employee can\'t have 2 titles with the same department');
    }
  }};

class CantBeSameEmployeeWithTwoTitlesDeptEmployeeError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantBeSameEmployeeWithTwoTitlesDeptEmployeeError');
  }
}

module.exports = {
  CantBeSameEmployeeWithTwoTitlesDeptEmployee,
};