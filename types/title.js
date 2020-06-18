const graphql = require('graphql');
const gnx = require('@simtlix/gnx');
const graphqlIsoDate = require('graphql-iso-date');

const EmployeeModel = require('../models/employee').Employee;
const TitleModel = require("../models/title").Title;

const EmployeeType = require('./employee');

const {AuditableObjectFields} = require('./extended_types/auditableGraphQLObjectType');
const { CantSetEndDateLessThanStartDate } = require('../validators/date.validator');
const { EmployeeMustToExist } = require('../validators/exist.validator');

const { GraphQLDate } = graphqlIsoDate;

const {
  GraphQLObjectType, GraphQLString, GraphQLID,
  GraphQLInt, GraphQLList, GraphQLNonNull
} = graphql;

//4 - Titles must have empId, title, from_date, to_date
const TitleType = new GraphQLObjectType({
  name: 'TitleType',
  description: 'Represent Title',
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
    title: { type: GraphQLNonNull(GraphQLString) },
    fromDate: { type: GraphQLDate },
    toDate: { type: GraphQLDate },
  })
});

gnx.connect(TitleModel, TitleType, 'Title', 'Titles');

module.exports = TitleType;

