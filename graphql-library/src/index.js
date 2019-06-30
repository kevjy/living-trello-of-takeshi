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
        name
        cards {
          id
          name
          desc
        }
      }
    }
  }
`

graphql(schema, query, resolvers, {Trello}).then(result => result.data).then(JSON.stringify).then(console.log)