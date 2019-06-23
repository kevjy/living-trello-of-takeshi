import 'dotenv/config'
import https from 'https'
const {TRELLO_OAUTH_TOKEN, TRELLO_API_KEY, TRELLO_BOARD_ID} = process.env

export default {
  key: TRELLO_API_KEY,
  token: TRELLO_OAUTH_TOKEN,
  call(query) {
    const {key, token} = this
    for (const stringParam of [query, key, token]) {
      if (typeof stringParam !== 'string') {
        throw new Error('TypeError: string type expected for query, key and token.')
      }
    }
    const qs = [sanitizeEnds, addAuth(key, token)].reduce((acc, cv) => cv(acc), query)
    const requestURL = `https://api.trello.com/1/${qs}`
    return new Promise((resolve, reject) => https.get(requestURL, withHandler(resolve, reject)))
  },
}

export function sanitizeEnds(query) {
  let qs = query
  if (query.charAt(0) === '/') {
    qs = query.slice(1)
  }
  if (qs.charAt(qs.length-1) === '&') {
    qs = qs.slice(0, qs.length-1)
  }
  return qs
}

export function addAuth(key, token) {
  return (query) => {
    let qs = query
    qs += `${qs.includes('?')? '&':'?'}key=${key}&token=${token}&card_limit=1000`
    return qs
  }
}

export function withHandler(resolve, reject) {
  return function callback(res) {
    const { statusCode } = res
    const contentType = res.headers['content-type']
    let err
    if (statusCode !== 200) {
      err = new Error('Request Failed.\n' + `Status Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      err = new Error('Invalid content-type.\n' +`Expected application/json but received ${contentType}`)
    }
    if (err) reject(err)
    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData)
        resolve(parsedData)
      } catch(e) {
        reject(`Error: ${e.message}`)
      }
    })
  }
}


