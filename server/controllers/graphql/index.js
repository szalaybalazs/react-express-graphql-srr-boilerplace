const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLJSON } = require('graphql-type-json');
const { GraphQLDate, GraphQLTime, GraphQLDateTime } = require('graphql-iso-date');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');
const ObjectId = require('mongoose').Types.ObjectId;

const typeDefs = require('./schema');

const server = new ApolloServer({
  typeDefs: gql`${typeDefs}`,
  resolvers: {
    Query: require('./Query'),
    Mutation: require('./Mutation'),
    Subscription: require('./Subscription'),
    ...require('./customs'),
    JSON: GraphQLJSON,
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
  },
  context: async ({ req, connection }) => {
    if (connection) return connection.context;
    const user = req.headers.authorization || '';
    const school = req.headers.school || '';

    const language = req.headers.language;

    return { user: ObjectId.isValid(user) ? user : null, school, language };
  }
});

module.exports = (app, http) => {
  // Graphql auth
  app.get('/graphql', (req, res, next) => {
    if (req.xhr) return next();
    basicAuth({
      challenge: true,
      unauthorizedResponse: req => 'No credentials provided',
      users: { 'admin': 'almalee' }
    })(req, res, next);
  });
  
  server.applyMiddleware({ app, path: '/graphql' });
  server.installSubscriptionHandlers(http);
};
