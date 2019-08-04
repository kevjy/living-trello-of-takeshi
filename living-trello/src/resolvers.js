export default {
  // Query Resolvers (camel)
  ping: () => 'Living Trello of Takeshi: GraphQL API v0.0.1',
  board: ({id}, {Trello}) => 
    Trello.call(`/boards/${id}/lists`)
      .then(filterOutNonRecurringLists)
      .then(lists => Promise.all(lists.map(getCardsInList(Trello))))
      .then(lists => ({lists}))
      .catch(console.error),
}

/**
 * @param {Array} lists - Trello lists filtered to return those with names including string "recur"
 */
function filterOutNonRecurringLists(lists) {
  return lists.filter(list => list.name.toLowerCase().includes('recur'))
}

/**
 * @param {Object} Trello - API call to get the cards inside a list
 */
function getCardsInList(Trello) {
  return list => Trello.call(`/lists/${list.id}/cards`)
    .then(cards => ({...idProps(list), cards: cards.map(idProps)}))
    .catch(err => console.error('Failed Promise array: ', err))
}

/**
 * Deconstructs an object to its properties id, name, and desc.
 */
function idProps({id, name, desc}) {
  return {id, name, desc}
}