const graphql = require('graphql')
const _ = require('lodash')
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql')

// 假数据
const books = [
  { name: '算法导论', genre: '计算机科学', id: '1' },
  { name: '人性的弱点', genre: '社交', id: '2' },
  { name: '明朝那些事儿', genre: '历史', id: '3' },
]

console.log(_.find(books, { id: '3' }))

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // 从哪里得到数据，比如数据库或其他来源
        // 这里使用假数据来模拟
        return _.find(books, { id: args.id })
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
