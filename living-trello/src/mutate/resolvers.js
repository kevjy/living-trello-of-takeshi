import Trello from '../trello'
export default {
  getList: ({byId}, {Trello}) => ({
    addCard: ({withName}) => (
      Trello.call({
        path: '/cards',
        qs: {
          idList: byId,
          name: withName
        },
        method: 'POST'
      }).catch(console.error)
    )
  })
}