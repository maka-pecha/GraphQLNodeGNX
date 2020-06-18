const graphql = require('graphql');
const gnx = require('@simtlix/gnx');
const graphqlIsoDate = require('graphql-iso-date');

const EmployeeModel = require('../models/employee').Employee;
const DepartmentModel = require('../models/department').Department;
const DeptManagerModel = require("../models/deptManager").DeptManager;

const EmployeeType = require('./employee');
const DepartmentType = require('./department');

const {AuditableObjectFields} = require('./extended_types/auditableGraphQLObjectType');
const { CantSetEndDateLessThanStartDate } = require('../validators/date.validator');
const { EmployeeMustToExist, DepartmentMustToExist } = require('../validators/exist.validator');
const { CantBeTwoEmployeesAtSameTime } = require('../validators/department.validator');

const { GraphQLDate } = graphqlIsoDate;

const {
  GraphQLObjectType, GraphQLString, GraphQLID,
  GraphQLInt, GraphQLList, GraphQLNonNull
} = graphql;

//4 - DeptosManager must have empId, deptManager, from_date, to_date
const DeptManagerType = new GraphQLObjectType({
  name: 'DeptManagerType',
  description: 'Represent Department of Managers',
  extensions: {
    validations: {
      'CREATE':
        [ CantSetEndDateLessThanStartDate, EmployeeMustToExist, DepartmentMustToExist, CantBeTwoEmployeesAtSameTime ],
      'UPDATE':
        [ CantSetEndDateLessThanStartDate, EmployeeMustToExist, DepartmentMustToExist, CantBeTwoEmployeesAtSameTime ],
    },
  },
  fields: () => ({
    id: { type: GraphQLID },
    employee: {
      type: GraphQLNonNull(EmployeeType),
      extensions: {
        relation: {
          embedded: false,
          connectionField: 'empId',
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
          connectionField: 'deptId',
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

gnx.connect(DeptManagerModel, DeptManagerType, 'DeptManager', 'DeptosManager');

module.exports = DeptManagerType;

