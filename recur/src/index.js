import moment from 'moment'
import dateSet from './date-set'

function main() {

  const now = moment() // TODO: consider timezone

  getRecurringCards()
    .then(filterCards(now))
    .then(createRecurredCards)
    .catch(err => console.log(err))

  console.log({...{a: 5, b: 6}, ...{a:'a', c:5}})
}

/**
 * Gets recurring cards.
 *
 * @returns {Object[]} Array of card objects containing field "yaml"
 */
function getRecurringCards() {
  // TODO: Replace with graphql query to get cards in recur list
  const card = {
    yaml: `
recur:
  every:
    multiplier: 1
    period: 'month'
  on:
    day: 1
  begin: '01/01/2019'
`
  }
  return new Promise((resolve, reject) => {
    resolve([card])
  })
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
