import Promise from 'bluebird'
import {graphql} from 'graphql'
import schema from './schema'
import resolvers from './resolvers'
import Trello from './trello'

const query = `
  query { 
    ping
    board(id:"Btjbcfio") {
      lists {
        id
        cards {
          id
          desc
        }
      }
    }
  }
`

graphql(schema, query, resolvers, {Trello}).then(result => result.data).then(console.log)