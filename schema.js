const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryTypeeee',

    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello Worlddd!'
      }
    }
  })
})


module.exports = schema
