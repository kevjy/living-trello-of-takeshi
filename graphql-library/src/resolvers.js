export default {
  ping: () => 'Living Trello of Takeshi: GraphQL API v0.0.1',
  board: ({id}, {Trello}) => 
    Trello.call(`/boards/${id}/lists`)
      .then(filterOutNonRecurringLists)
      .then(lists => Promise.all(lists.map(mapListToPromise(Trello))))
      .then(lists => ({lists}))
      .catch(console.error)
}

function filterOutNonRecurringLists(lists) {
  return lists.filter(list => list.name.toLowerCase().includes('recur'))
}

function mapListToPromise(Trello) {
  return list => Trello.call(`/lists/${list.id}/cards`)
    .then(cards => ({...list, cards}))
    .catch(err => console.error('Failed Promise array: ', err))
}