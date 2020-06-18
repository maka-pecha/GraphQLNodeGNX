const express = require('express');
// eslint-disable-next-line
const gnx = require('@simtlix/gnx');
const app = express();

const graphqlHTTP = require('express-graphql');

const mongoose = require('mongoose');
mongoose.plugin(require('./plugins/auditablePluginSchema'));

mongoose.connect('mongodb://Maka-PC:27017,Maka-PC:27018,Maka-PC:27019/example', { replicaSet: 'rs', useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', () => {
  console.log('connected to database')
});

const types = require('./types');
const includedTypes = Object.values(types);
const schema = gnx.createSchema(includedTypes,includedTypes);

app.use('/graphql', graphqlHTTP({
    // Directing express-graphql to use this schema to map out the graph
    schema,
    /* Directing express-graphql to use graphiql when goto '/graphql' address in the browser
    which provides an interface to make GraphQl queries */
    graphiql: true,
  }));

app.listen(3000, () => {
    console.log('Listening on port 3000')
});