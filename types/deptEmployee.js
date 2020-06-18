const graphql = require('graphql');
const gnx = require('@simtlix/gnx');
const graphqlIsoDate = require('graphql-iso-date');

const EmployeeModel = require('../models/employee').Employee;
const DepartmentModel = require('../models/department').Department;
const DeptEmployeeModel = require("../models/deptEmployee").DeptEmployee;

const EmployeeType = require('./employee');
const DepartmentType = require('./department');

const {AuditableObjectFields} = require('./extended_types/auditableGraphQLObjectType');
const { CantSetEndDateLessThanStartDate } = require('../validators/date.validator');
const { EmployeeMustToExist, DepartmentMustToExist } = require('../validators/exist.validator');
const CantBeSameEmployeeWithTwoTitlesDeptEmployee = require('../validators/deptEmployee.validator').CantBeSameEmployeeWithTwoTitlesDeptEmployee;
const CantBeTwoEmployeesAtSameTime = require('../validators/department.validator').CantBeTwoEmployeesAtSameTime;

const { GraphQLDate } = graphqlIsoDate;

const {
  GraphQLObjectType, GraphQLString, GraphQLID,
  GraphQLInt, GraphQLList, GraphQLNonNull
} = graphql;

//4 - DeptosEmployee must have empId, deptEmployee, from_date, to_date
const DeptEmployeeType = new GraphQLObjectType({
  name: 'DeptEmployeeType',
  description: 'Represent Department of Employees',
  extensions: {
    validations: {
      'CREATE':
        [ CantSetEndDateLessThanStartDate, EmployeeMustToExist, DepartmentMustToExist, CantBeTwoEmployeesAtSameTime, CantBeSameEmployeeWithTwoTitlesDeptEmployee ],
      'UPDATE':
        [ CantSetEndDateLessThanStartDate, EmployeeMustToExist, DepartmentMustToExist, CantBeSameEmployeeWithTwoTitlesDeptEmployee, CantBeTwoEmployeesAtSameTime ],
    },
  },
  fields: () => ( {
    id: { type: GraphQLID },
    employee: {
      type: GraphQLNonNull(EmployeeType),
      extensions: {
        relation: {
          embedded: false,
          connectionField: "empId",
        },
      },
      resolve(parent, args) {
        return EmployeeModel.findById(parent.empId);
      },
    },
    department: {
      type: GraphQLNonNull(DepartmentType),
      extensions: {
        relation: {
          embedded: false,
          connectionField: "deptId",
        },
      },
      resolve(parent, args) {
        return DepartmentModel.findById(parent.deptId);
      },
    },
    fromDate: { type: GraphQLDate },
    toDate: { type: GraphQLDate },
  })
});

gnx.connect(DeptEmployeeModel, DeptEmployeeType, 'DeptEmployee', 'DeptosEmployee');

module.exports = DeptEmployeeType;

