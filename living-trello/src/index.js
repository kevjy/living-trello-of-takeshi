/*
 * Library Example Usage
 * =====================
 * import 'dotenv/config'
 * import {trelloKey, trelloToken} from process.env
 * import LT from 'living-trello'
 * const myQuery = `query {...MySDL}`
 * const lt = new LT(trelloKey, trelloToken)
 * lt.query(myQuery).then(console.log) // returns a promise.
 */

import {graphql} from 'graphql'
import schema from './schema'
import resolvers from './resolvers'
import Trello from './trello'

const LivingTrello = (function(Trello, graphql, schema, resolvers) {

  var t

  function lt(key, token) {
    t = new Trello(key, token) // Deny access to our Trello Node.js interface. It's intended for use via GraphQL interface. 
  }

  // GraphQL Interface below.
  lt.prototype.query = function query(q) {
    if (t) {
      return graphql(schema, q, resolvers, {Trello: t}).then(({data}) => data)
    } else {
      throw new Error('Must set key and token to authenticate Trello via constructor(key, token).')
    }
  }

  return lt

})(Trello, graphql, schema, resolvers)

export default LivingTrello
