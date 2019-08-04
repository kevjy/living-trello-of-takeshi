import moment from 'moment'
import dateSet from '../src/date-set'

const bad = `
recur:
  every:
    period: 'week'
`
// 01/01/2019 is a tuesday
const weekly = `
recur:
  every:
    multiplier: 1
    period: 'week'
  on:
    day: 2
  begin: '01/01/2019'
`
const monthly = `
recur:
  every:
    multiplier: 1
    period: 'month'
  on:
    day: 1
  begin: '01/01/2019'
`


describe('dateSet', () => {
  it('should always return false for bad yamls', () => {
    const ds = dateSet(bad)
    const beginDate = moment('01/01/2019', 'DD/MM/YYYY')
    for (let i = 1; i < 100; i++) {
      expect(ds(beginDate.add(1, 'days'))).toBeFalsy()
      expect(ds(beginDate.add(1, 'months'))).toBeFalsy()
    }
  })
  it('should correctly filter weekly events', () => {
    const ds = dateSet(weekly)
    const beginDate = moment('01/01/2019', 'DD/MM/YYYY')
    for (let i = 1; i < 100; i++) {
      expect(ds(beginDate.add(7, 'days'))).toBeTruthy()
      expect(ds(beginDate.clone().add(1, 'days'))).toBeFalsy()
      expect(ds(beginDate.clone().subtract(1, 'days'))).toBeFalsy()
    }
  })
  it('should correctly filter monthly events', () => {
    const ds = dateSet(monthly)
    const beginDate = moment('01/01/2019', 'DD/MM/YYYY')
    for (let i = 1; i < 100; i++) {
      const added = beginDate.add(1, 'months')
      expect(ds(added)).toBeTruthy()
      expect(ds(added.clone().add(1, 'days'))).toBeFalsy()
      expect(ds(added.clone().subtract(1, 'days'))).toBeFalsy()
    }
  })
})
