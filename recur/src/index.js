import YAML from 'yaml'
import moment from 'moment'
import {Validator} from 'jsonschema'


const every = {
  id: '/Every',
  type: 'object',
  properties: {
    multiplier: {
      type: 'integer',
      minimum: 1
    },
    period: {
      type: 'string',
      enum: ['week', 'month']
    }
  }
}

const on = {
  id: '/On',
  type: 'object',
  properties: {
    day: {
      type: 'integer',
      minimum: 1,
      maximum: 31
    }
  }
}

const begin = {
  id: '/Begin',
  type: 'string'
}

const schema = {
  id: '/Recur',
  type: 'object',
  properties: {
    every: {'$ref': '/Every'},
    on: {'$ref': '/On'},
    begin: {'$ref': '/Begin'},
  }
}

const defaults = {
  every: {
    multiplier: 1
  },
  begin: '01/01/2019'
}


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
 * Parses a yaml string as a recur-configuration.
 *
 * @param {string} yaml - Recur-configuration as a string in yaml format
 * @returns {Object} Object with parsed recur-configuration
 */
function parse(yaml) {
  const parsed = YAML.parse(yaml)
  const withDefaults = {...defaults, ...parsed.recur}
  const v = new Validator();
  v.addSchema(every, '/Every')
  v.addSchema(on, '/On')
  v.addSchema(begin, '/Begin')
  const result = v.validate(withDefaults, schema)
  return {recur: withDefaults, errors: result.errors}
}

/**
 * Creates a date set for an n-weekly period.
 *
 * @param {Moment} begin - Begin date
 * @param {number} on - Recurring day of the week (1-based starting on Monday)
 * @param {number} mult - Period multiplier
 * @returns {function} Date set function
 */
function week(begin, on, mult) {
  return date => 
    (on === date.day()) && (begin.week() % mult === date.week() % mult)
}

/** 
 * Creates a date set for an n-monthly period.
 *
 * @param {Moment} begin - Begin date
 * @param {number} on - Recurring date of the month
 * @param {number} mult - Period multiplier
 * @returns {function} Date set function
 */
function month(begin, on, mult) {
  return date =>
    (on === date.date()) && (begin.month() % mult === date.month() % mult)
}

/** 
 * Creates a date set with a yaml config. 
 *
 * @param {string} yaml - Recur-configuration string in yaml format
 * @returns {function} A function that chcks whether a given date exists in the
 * configured date set.
 */
function dateSet(yaml) {
  const {recur, errors} = parse(yaml)
  const contains = {
    week,
    month
  }
  return errors.length === 0 ? 
    contains[recur.every.period](
      moment(recur.begin, 'DD/MM/YYYY'), 
      recur.on.day, 
      recur.every.multiplier 
    ) 
    : () => false
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
