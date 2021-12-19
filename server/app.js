const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()

// 连接MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/graphql_deep_in', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', () => {
  console.log('***数据库连接失败***')
})

db.on('open', () => {
  console.log('***数据库连接成功***')
})

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(5004, () => {
  console.log('serve listening 5004')
})
