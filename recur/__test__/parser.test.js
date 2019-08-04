import {defaults, parse} from '../src/parser'

const emptyYaml = ''
const noRecurYaml = `
hello: 'world'
`
const noEveryYaml = `
recur:
  on:
    day: 1
`
const noMultiplierYaml = `
recur:
  every:
    period: 'month'
  on:
    day: 1
`
const noPeriodYaml = `
recur:
  every:
    multiplier: 1
  on:
    day: 1
`
const noOnDayYaml = `
recur:
  every:
    multiplier: 1
    period: 'week'
`
const goodYaml = `
recur:
  every:
    multiplier: 1
    period: 'month'
  on:
    day: 1
  begin: '01/01/2019'
`
const partialYaml = `
recur:
  every:
    multiplier: 1
    period: 'month'
  on:
    day: 1
`
const goodPlusMoreYaml = `
recur:
  every:
    multiplier: 1
    period: 'month'
  on:
    day: 1
  begin: '01/01/2019'
  other: 'random'
  more: 'stuff'
`

describe('parse', () => {
  it('should return error given empty string', () => {
    expect(parse(emptyYaml).errors.length).toBeGreaterThan(0)
  })
  it('should return error given no recur field', () => {
    expect(parse(noRecurYaml).errors.length).toBeGreaterThan(0)
  })
  it('should return error given no every field', () => {
    expect(parse(noEveryYaml).errors.length).toBeGreaterThan(0)
  })
  it('should return error given no multiplier field', () => {
    expect(parse(noMultiplierYaml).errors.length).toBeGreaterThan(0)
  })
  it('should return error given no period field', () => {
    expect(parse(noPeriodYaml).errors.length).toBeGreaterThan(0)
  })
  it('should return error given no on day field', () => {
    expect(parse(noOnDayYaml).errors.length).toBeGreaterThan(0)
  })
  it('should return json form of input yaml recur', () => {
    expect(parse(goodYaml)).toEqual({
      errors: [],
      recur: {
        every: {
          multiplier: 1,
          period: 'month',
        },
        on: {
          day: 1,
        },
        begin: '01/01/2019',
      },
    })
  })
  it('should use default begin date if missing', () => {
    expect(parse(partialYaml)).toEqual({
      errors: [],
      recur: {
        every: {
          multiplier: 1,
          period: 'month',
        },
        on: {
          day: 1,
        },
        begin: '01/01/2019',
      },
    })
  })
  it('should still work with random additional fields', () => {
    expect(parse(goodPlusMoreYaml)).toEqual({
      errors: [],
      recur: {
        every: {
          multiplier: 1,
          period: 'month',
        },
        on: {
          day: 1,
        },
        begin: '01/01/2019',
        other: 'random',
        more: 'stuff',
      },
    })
  })
})

