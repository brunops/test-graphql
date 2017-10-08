const util = require('util')
const fetch = require('node-fetch')
const xml2js = require('xml2js')

const parseXML = util.promisify(xml2js.parseString)

const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} = require('graphql')

const Book = new GraphQLObjectType({
  name: 'Book',

  fields: {
    title: {
      type: GraphQLString,
      resolve: book => book.title[0]
    },
    pages: {
      type: GraphQLString,
      resolve: book => book.num_pages[0]
    },
    date: {
      type: GraphQLString,
      resolve: book => new Date(book.publication_year, book.publication_month, book.publication_day).toDateString()
    },
    isbn: {
      type: GraphQLString,
      resolve: book => book.isbn[0]
    }
  }
})

const byDate = (a, b) => {
  const aDate = new Date(a.publication_year, a.publication_month, a.publication_day)
  const bDate = new Date(b.publication_year, b.publication_month, b.publication_day)
  return aDate - bDate
}

const Author = new GraphQLObjectType({
  name: 'Author',

  fields: {
    id: {
      type: GraphQLString,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].id[0]
    },
    name: {
      type: GraphQLString,
      resolve: xml =>
        xml.GoodreadsResponse.author[0].name[0]
    },
    books: {
      type: new GraphQLList(Book),
      resolve: xml => xml.GoodreadsResponse.author[0].books[0].book.sort(byDate)
    }
  }
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',

    fields: {
      author: {
        type: Author,
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve: (root, args) => fetch(`
          https://www.goodreads.com/author/show.xml?id=${args.id}&key=zlQOA04N2XAkFYGIYyu3g
        `)
        .then(response => response.text())
        .then(parseXML)
      }
    }
  })
})


module.exports = schema
