const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const DepartmentModel = require('../models/department').Department;
const DeptManagerModel = require('../models/deptManager').DeptManager;
const DeptEmployeeModel = require('../models/deptEmployee').DeptEmployee;

const CantRepeatDeptName ={
  validate: async function(typeName, originalObject, materializedObject) {
    const DepartmentFound = await DepartmentModel.findOne({'deptName': materializedObject.deptName});

    if (DepartmentFound && DepartmentFound._id != materializedObject.id) {
      throw new CantExistDepartmentWithNameUsedError(typeName, 'DeptName can\'t be repeated');
    }
  }};
class CantExistDepartmentWithNameUsedError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantExistDepartmentWithNameUsedError');
  }
}

const CantDeleteDepartmentWithRelations = {
  validate: async function(typeName, originalObject, materializedObject) {

    const DeptManagerFound = await DeptManagerModel.findOne({'deptId':originalObject});
    const DeptEmployeeFound = await DeptEmployeeModel.findOne({'deptId':originalObject});

    if (DeptManagerFound) {
      throw new CantDeleteDepartmentWithRelationsError(typeName, 'The Department has a relation in DeptManager, should not be removed');
    } else if (DeptEmployeeFound) {
      throw new CantDeleteDepartmentWithRelationsError(typeName, 'The Department has a relation in DeptEmployee, should not be removed');
    }
  }
};

class CantDeleteDepartmentWithRelationsError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantDeleteDepartmentWithRelationsError');
  }
}

const CantBeTwoEmployeesAtSameTime ={
  validate: async function (typeName, originalObject, materializedObject) {
    const fromDate1 = materializedObject.fromDate;
    const toDate1 = materializedObject.toDate;

    const EmployeesFound = await DeptEmployeeModel.find({'deptId': materializedObject.deptId});

    console.log(EmployeesFound, "employes");
    if(EmployeesFound){
      const fromDate2 =  EmployeesFound.fromDate;
      const toDate2 =  EmployeesFound.toDate;
      if ((fromDate2 < toDate1 && toDate1 < toDate2) || (fromDate1 < toDate2 && toDate2 < toDate1) || (fromDate1 === fromDate2 && toDate1 === toDate2)) {
        throw new CantBeTwoEmployeesAtSameTimeError(typeName, 'Can\'t have 2 employees assigned to the same department in the same portion of time');
      }
    }
  }};
class CantBeTwoEmployeesAtSameTimeError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantBeTwoEmployeesAtSameTimeError');
  }
}

module.exports ={
  CantRepeatDeptName,
  CantDeleteDepartmentWithRelations,
  CantBeTwoEmployeesAtSameTime
};