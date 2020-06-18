const graphql = require('graphql');
const gnx = require('@simtlix/gnx');
const {
  GraphQLObjectType, GraphQLString, GraphQLNonNull
} = graphql;

const NameType = new GraphQLObjectType({
  name: 'Name',
  description: 'Represent Name',
  fields: () => ({
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
  })
});

gnx.addNoEndpointType(NameType);

module.exports = NameType;