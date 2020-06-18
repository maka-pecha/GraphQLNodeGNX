const graphql = require('graphql');
const gnx = require('@simtlix/gnx');

const graphqlIsoDate = require('graphql-iso-date');
const DepartmentModel = require("../models/department").Department;
const { AuditableObjectFields } = require('./extended_types/auditableGraphQLObjectType');
const { CantRepeatDeptName, CantDeleteDepartmentWithRelations } = require('../validators/department.validator');

const { GraphQLDate } = graphqlIsoDate;

const {
  GraphQLObjectType, GraphQLString, GraphQLID,
  GraphQLInt, GraphQLList, GraphQLNonNull
} = graphql;

//5 - Departments must have dept_name
const DepartmentType = new GraphQLObjectType({
  name: 'DepartmentType',
  description: 'Represent Department',
  extensions: {
    validations: {
      'CREATE':
        [CantRepeatDeptName],
      'UPDATE':
        [CantRepeatDeptName],
      'DELETE' :
        [CantDeleteDepartmentWithRelations],
    },
  },
  fields: () => ( {
    id: { type: GraphQLID },
    deptName: { type: GraphQLNonNull(GraphQLString) },
  })
});

gnx.connect(DepartmentModel, DepartmentType, 'Department', 'Departments');

module.exports = DepartmentType;
