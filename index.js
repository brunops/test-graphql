const express = require('express')
const gql = require('express-graphql')

const schema = require('./schema')

const app = express()

const port = 4444

app.use('/graphql', gql({
  schema: schema,
  graphiql: true
}))

app.listen(port, () => {
  console.log(`App listening on port ${port}...`)
})
