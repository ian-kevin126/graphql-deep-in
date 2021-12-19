const graphql = require('graphql')
const _ = require('lodash')
const Book = require('../models/book')
const Author = require('../models/author')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql')

// 假数据，一本书对应一个作者，一个作者可能对应多本书，这就是一对多和多对一的关系
const books = [
  { name: '算法导论', genre: '计算机科学', id: '1', authorId: '1' },
  { name: '人性的弱点', genre: '社交', id: '2', authorId: '2' },
  { name: '明朝那些事儿', genre: '历史', id: '3', authorId: '3' },
  { name: 'JavaScript深入浅出', genre: '计算机科学', id: '4', authorId: '1' },
  { name: '性格决定命运', genre: '社交', id: '5', authorId: '2' },
  { name: '康熙王朝', genre: '历史', id: '6', authorId: '3' },
]

// 作者
const authors = [
  { name: 'kevin', age: 22, id: '1' },
  { name: 'tom', age: 43, id: '2' },
  { name: 'ian', age: 23, id: '3' },
]

console.log(_.find(books, { id: '3' }))

// GraphQLID：表示String或者number都可以，查询的时候就可以穿"2"或者直接2，graphql会把数字的2转化成string
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    // 查询一本书以及对应的作者
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent.authorId)
        // return _.find(authors, { id: parent.authorId })
        // 真实的graphql语句
        return Author.findById(parent.authorId)
      },
    },
  }),
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    // 查询一个作者以及他的书
    books: {
      // 返回一个数组就用 GraphQLList
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books, { authorId: parent.id })
        // 真实的graphql语句
        return Book.find({ authorId: parent.id })
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // 从哪里得到数据，比如数据库或其他来源
        // 这里使用假数据来模拟
        // return _.find(books, { id: args.id })
        return Book.findById(args.id)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id })
        return Author.findById(args.id)
      },
    },
    // 查询所有的书籍列表
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
        // 返回所有的books
        return Book.find({})
      },
    },
    // 查询所有的作者列表
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors
        // 返回所有的author
        return Author.find({})
      },
    },
  },
})

// 增删改操作
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      // 禁止参数为空，使用new GraphQLNonNull
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        // 新增一个author
        let author = new Author({
          name: args.name,
          age: args.age,
        })
        // 保存在数据库
        return author.save()
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        })

        return book.save()
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
})

/**
 * 增加一条数据
mutation {
  addAuthor(name: "汉武大帝", age: 67) {
    id
    name
    age
  }
}
 * 
 */
