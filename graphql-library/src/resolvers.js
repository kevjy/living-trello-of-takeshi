function filterOutNonRecurringLists(lists) {
  return lists.filter(list => list.name.toLowerCase().includes('recur'))
}

export default {
  ping: () => 'Living Trello of Takeshi: GraphQL API v0.0.1',
  board: ({id}, {Trello}) => 
    Trello.call(`/boards/${id}/lists`)
      .then(filterOutNonRecurringLists)
      .then(lists => {
        const promiseArr = lists.map(list => () => 
          new Promise((resolve, reject) => 
            Trello.call(`/lists/${list.id}/cards`)
              .then(cards => resolve({...list, cards}))
              .catch(err => reject('Failed Promise array: ' + err))
          )
        )
        return Promise.all(promiseArr.map(execute => execute()))
      })
      .then(lists => ({lists}))
      .catch(console.error)
}