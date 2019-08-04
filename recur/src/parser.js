import YAML from 'yaml'
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
  },
  required: ['multiplier', 'period']
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
  },
  required: ['day']
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
  },
  required: ['every', 'on', 'begin']
}

export const defaults = {
  begin: '01/01/2019'
}

/**
 * Parses a yaml string as a recur-configuration.
 *
 * @param {string} yaml - Recur-configuration as a string in yaml format
 * @returns {Object} Object with parsed recur-configuration
 */
export const parse = (yaml) => {
  const parsed = YAML.parse(yaml)
  if (!parsed || !parsed.recur) {
    return {recur: {}, errors: ["Bad input yaml"]}
  }
  const withDefaults = {...defaults, ...parsed.recur}
  const v = new Validator();
  v.addSchema(every, '/Every')
  v.addSchema(on, '/On')
  v.addSchema(begin, '/Begin')
  const result = v.validate(withDefaults, schema)
  return {recur: withDefaults, errors: result.errors}
}

