const graphql = require('graphql');
const graphqlIsoDate = require('graphql-iso-date');
const gnx = require('@simtlix/gnx');

const EmployeeModel = require('../models/employee').Employee;
// const {SalaryModel} = require('../models/salary');
// const {DeptManagerModel} = require('../models/deptManager');
// const {DeptEmployeeModel} = require('../models/deptEmployee');
//
// const SalaryType = require('../types/salary');
// const DeptManagerType = require('../types/deptManager');
// const DeptEmployeeType = require('../types/deptEmployee');
const NameType = require('../types/name');

const GenderTypeEnum = require('./enums/gender.enum');
const {AuditableObjectFields} = require('./extended_types/auditableGraphQLObjectType');

const { CantRepeatDni, CantBeUnderEighteen, CantDeleteEmployeeWithRelations } = require('../validators/employee.validator');

const { GraphQLDate } = graphqlIsoDate;

const {
  GraphQLString, GraphQLNonNull, GraphQLID,
  GraphQLObjectType, GraphQLList ,GraphQLInt
} = graphql;

//2 - Employee must have dni, birth_date, first_name, last_name, gender, hire_date
const EmployeeType = new GraphQLObjectType({
  name: 'EmployeeType',
  description: 'Represent employees',
  extensions: {
    validations: {
      'CREATE':
        [ CantRepeatDni, CantBeUnderEighteen ],
      'UPDATE':
        [ CantRepeatDni, CantBeUnderEighteen ],
      'DELETE' :
        [ CantDeleteEmployeeWithRelations ],
    },
  },
  fields: () => ({
    id: {type: GraphQLID},
    dni: {type: GraphQLNonNull(GraphQLInt)},
    birthDate: {type: GraphQLDate},
    name: {
      type: NameType,
      extensions: {
        relation: {
          embedded: true,
        },
      }
    },
    gender: {type: GraphQLNonNull(GenderTypeEnum)},
    hireDate: {type: GraphQLDate},
    // salary: {
    //   type: SalaryType,
    //   extensions: {
    //     relation: {
    //       embedded: false,
    //       connectionField: 'empId',
    //     },
    //   },
    //   resolve(parent, args) {
    //     return SalaryModel.find({'empId': parent.id});
    //   },
    // },
    // deptManager: {
    //   type: DeptManagerType,
    //   extensions: {
    //     relation: {
    //       embedded: false,
    //       connectionField: 'empId',
    //     },
    //   },
    //   resolve(parent, args) {
    //     return DeptManagerModel.find({'empId': parent.id});
    //   },
    // },
    // deptEmployee: {
    //   type: DeptEmployeeType,
    //   extensions: {
    //     relation: {
    //       embedded: false,
    //       connectionField: 'empId',
    //     },
    //   },
    //   resolve(parent, args) {
    //     return DeptEmployeeModel.find({'empId': parent.id});
    //   },
    // }
  }),
});

gnx.connect(EmployeeModel, EmployeeType, 'Employee', 'Employees');

module.exports = EmployeeType;

