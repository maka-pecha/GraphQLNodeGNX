const gnx = require('@simtlix/gnx');
const GNXError = gnx.GNXError;
const EmployeeModel = require('../models/employee').Employee;
const SalaryModel = require('../models/salary').Salary;
const TitleModel = require('../models/title').Title;
const DeptManagerModel = require('../models/deptManager').DeptManager;
const DeptEmployeeModel = require('../models/deptEmployee').DeptEmployee;

const CantRepeatDni ={
  validate: async function(typeName, originalObject, materializedObject) {
    const EmployeeFound = await EmployeeModel.findOne({'dni': materializedObject.dni});

    if (EmployeeFound && EmployeeFound._id != materializedObject.id) {
      throw new CantExistEmployeeWithDniUsedError(typeName, 'DNI can\'t be repeated');
    }
  }};
class CantExistEmployeeWithDniUsedError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantExistEmployeeWithDniUsedError');
  }
}

const CantBeUnderEighteen = {
  validate: async function (typeName, originalObject, materializedObject) {
    const age = calculateAge(materializedObject.birthDate);

    function calculateAge(birthday) {
      const ageDif = Date.now() - birthday.getTime();
      const ageDate = new Date(ageDif); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    if (age && age < 18) {
      throw new CantBeUnderEighteenError(typeName, 'Employee can\'t be younger than 18 years old');
    }
  },
};

class CantBeUnderEighteenError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, "CantBeUnderEighteenError");
  }
}

const CantDeleteEmployeeWithRelations = {
  validate: async function(typeName, originalObject, materializedObject) {
    const SalaryFound = await SalaryModel.findOne({'empId': originalObject});
    const TitleFound = await TitleModel.findOne({'empId': originalObject});
    const DeptManagerFound = await DeptManagerModel.findOne({'empId':originalObject});
    const DeptEmployeeFound = await DeptEmployeeModel.findOne({'empId':originalObject});

    if (SalaryFound) {
      throw new CantDeleteEmployeeWithRelationsError(typeName, 'The employee has a relation in Salary, should not be removed');
    } else if (TitleFound) {
      throw new CantDeleteEmployeeWithRelationsError(typeName, 'The employee has a relation in Title, should not be removed');
    } else if (DeptManagerFound) {
      throw new CantDeleteEmployeeWithRelationsError(typeName, 'The employee has a relation in DeptManager, should not be removed');
    } else if (DeptEmployeeFound) {
      throw new CantDeleteEmployeeWithRelationsError(typeName, 'The employee has a relation in DeptEmployee, should not be removed');
    }
  }
};

class CantDeleteEmployeeWithRelationsError extends GNXError {
  constructor(typeName, message) {
    super(typeName, message, 'CantDeleteEmployeeWithRelationsError');
  }
}

const executeAuditableOnUpdating = async (objectId, modifiedObject) => {
  const promotionModel = gnx.getModel(PromotionType);
  return AuditableGraphQLObjectTypeController.onUpdating(
    objectId, modifiedObject, promotionModel
  );
};



module.exports ={
  CantRepeatDni,
  CantBeUnderEighteen,
  CantDeleteEmployeeWithRelations
};