import moment from 'moment'
import dateSet from './date-set'
import LT from 'living-trello'

const {TRELLO_API_KEY, TRELLO_OAUTH_TOKEN, TRELLO_BOARD_ID} = process.env
const lt = new LT(TRELLO_API_KEY, TRELLO_OAUTH_TOKEN)

function main() {

  const now = moment() // TODO: consider timezone

  getRecurringCards(TRELLO_BOARD_ID)
    .then(filterCards(now))
    .then(createRecurredCards)
    .catch(err => console.log(err))
}

/**
 * Gets recurring cards.
 *
 * @param {string} boardId - Trello board ID to query
 * @returns {Object[]} Array of card objects containing field "yaml"
 */
function getRecurringCards(boardId) {
  const query = `
    query {
      board(id:"${boardId}") {
        lists {
          cards {
            name
            desc
          }
        }
      }
    }
  `
  const getCards = ({cards}) => cards.map(({name, desc}) => ({name, yaml: desc}))
  return lt.query(query)
    .then(resp => resp.board.lists.flatMap(getCards))
}

/**
 * Given a date, returns a function that filters for cards that should be
 * recurred on that date.
 *
 * @param {Moment} date - A date
 * @returns {function} - Filter function for cards
 */
function filterCards(date) {
  return cards => cards.filter(card => dateSet(card.yaml)(date))
}

/**
 * Creates new cards on the user's trello board
 *
 * @param {Object[]} cards - Array of recurring cards
 */
function createRecurredCards(cards) {
  // TODO: Replace with graphql query to create new cards for each recurring
  console.log(cards)
}

main()
