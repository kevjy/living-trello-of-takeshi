import {buildSchema} from 'graphql'
export default buildSchema(`
  type Query {
    getList(byId: ID!): List
  }
  type List {
    addCard(withName: String!): Card
  }
  type Card {
    id: ID!
    name: String!
  }
`)