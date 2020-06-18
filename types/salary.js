const graphql = require('graphql');
const graphqlIsoDate = require('graphql-iso-date');
const {AuditableObjectFields} = require('./extended_types/auditableGraphQLObjectType');
const { CantSetEndDateLessThanStartDate } = require('../validators/date.validator');
const { EmployeeMustToExist } = require('../validators/exist.validator');

const EmployeeModel = require('../models/employee').Employee;
const EmployeeType = require('./employee');
const SalaryModel = require("../models/salary").Salary;

const gnx = require('@simtlix/gnx');

const { GraphQLDate } = graphqlIsoDate;

const {
  GraphQLObjectType, GraphQLString, GraphQLID,
  GraphQLInt, GraphQLList, GraphQLNonNull
} = graphql;

//3 - Salaries must have empId, salary, from_date, to_date
const SalaryType = new GraphQLObjectType({
  name: 'SalaryType',
  description: 'Represent Salary',
  extensions: {
    validations: {
      'CREATE':
        [ CantSetEndDateLessThanStartDate, EmployeeMustToExist ],
      'UPDATE':
        [ CantSetEndDateLessThanStartDate, EmployeeMustToExist ],
      'DELETE' :
        [
          // CantDeleteAuthorWithBooks,
        ],
    },
  },
  fields: () => ( {
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
    salary: { type: GraphQLNonNull(GraphQLInt) },
    fromDate: { type: GraphQLDate },
    toDate: { type: GraphQLDate },
  })
});

gnx.connect(SalaryModel, SalaryType, 'Salary', 'Salaries');

module.exports = SalaryType;

