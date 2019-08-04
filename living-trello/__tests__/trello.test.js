import Trello from '../src/trello'
const t = new Trello('MY_KEY','MY_TOKEN')
const {sanitizeEnds, addAuth, withHandler} = t

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

describe('withHandler', () => {
  it('should throw an error for not passing a function to resolve and reject', () => {
    expect(() => withHandler('','')).toThrow()
  })
})