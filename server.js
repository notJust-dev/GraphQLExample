var { graphql, buildSchema } = require('graphql');
var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { ruruHTML } = require('ruru/server');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    age: Int
  }
`);

// The rootValue provides a resolver function for each API endpoint
var rootValue = {
  hello: () => {
    return 'Hello world 123!';
  },
  age: () => {
    return 25;
  },
};

const app = express();

app.all('/graphql', createHandler({ schema, rootValue }));

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.listen(4000);
console.log(`
  Api running on: http://localhost:4000
  Test: http://localhost:4000/graphql?query={hello,age}
`);
