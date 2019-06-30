import {sanitizeEnds, addAuth} from '../src/trello'

describe('sanitizeEnds', () => {
  it('should return empty string given an empty string', () => {
    expect(sanitizeEnds('')).toEqual('')
  })
  it('should slice / character out of "/boards" and return "boards"', () => {
    expect(sanitizeEnds('/boards')).toEqual('boards')
  })
  it('should slice & char out of "boards?something=something&', () => {
    expect(sanitizeEnds('boards?something=something&')).toEqual('boards?something=something')
  })
  it('should return an empty string given "/&"', () => {
    expect(sanitizeEnds('/&')).toEqual('')
  })
})

describe('addAuth', () => {
  it('should add key: MY_KEY, token: MY_TOKEN', () => {
    expect(addAuth('MY_KEY','MY_TOKEN')('')).toEqual('?key=MY_KEY&token=MY_TOKEN&card_limit=1000')
  })
})

describe('withHandler', () => {
  it('should throw an error for not passing a function to resolve and reject', () => {
    expect(() => withHandler('','')).toThrow()
  })
})