import {buildSchema} from 'graphql'
export default buildSchema(`
  type Query {
    ping: String
    board(id: ID!): Board
  }
  type Board {
    id: ID!
    name: String!
    lists: [List!]!
  }
  type List {
    id: ID!
    name: String!
    cards: [Card!]!
  }
  type Card {
    id: ID!
    name: String!
    desc: String!
  }
`)