/**
 * Library Example Usage
 * =====================
 * import 'dotenv/config'
 * import {trelloKey, trelloToken} from process.env
 * import LT from 'living-trello'
 * const myQuery = `query {...MySDL}`
 * const lt = new LT(trelloKey, trelloToken)
 * lt.query(myQuery).then(console.log) // returns a promise.
 */

import { graphql } from 'graphql'
import query from './query'
import mutate from './mutate'
import Trello from './trello'

const LivingTrello = (

  // Deny access to our Trello Node.js interface. It's intended for use via GraphQL interface. 
  function closure( Trello, graphql, query, mutate ) {

    var t
    const ops = {query, mutate} // Each op is an Object with nested documents {schema: Schema, resolvers: Resolvers}

    function lt(key, token) {
      t = new Trello(key, token) 
    }

    Object.entries(ops).forEach(([key, {schema, resolvers}]) => {
      lt.prototype[key] = function(q) {
        if (t) {
          return graphql(schema, q, resolvers, {Trello: t})
            .then(({data}) => data)
            .catch(console.error)
        } else {
          throw new Error('Must set key and token to authenticate Trello via constructor(key, token).')
        }
      }
    })

    return lt

  }

)( Trello, graphql, query, mutate )

export default LivingTrello
