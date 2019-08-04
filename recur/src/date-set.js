import moment from 'moment'
import {parse} from './parser'

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
export default function dateSet(yaml) {
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
