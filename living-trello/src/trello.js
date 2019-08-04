import https from 'https'
const {TRELLO_OAUTH_TOKEN, TRELLO_API_KEY, TRELLO_BOARD_ID} = process.env

export default class Trello {
  constructor(key, token) {
    this.key = key
    this.token = token
  }
  call(query) {
    const {sanitizeEnds, withHandler} = this
    const requestURL = `https://api.trello.com/1/${sanitizeEnds(query)}?key=${this.key}&token=${this.token}&card_limit=1000`
    return new Promise(this.requestExecutor.bind(requestURL))
  }
  /**
   * Parses the query string to ensure that excess chars are removed before passing it back to Trello.call
   * @param {String} query - the endpoint string without hostname, e.g. "/boards"
   */
  sanitizeEnds(query) {
    let qs = query
    if (query.charAt(0) === '/') {
      qs = query.slice(1)
    }
    if (['&','?'].some(char => char === qs.charAt(qs.length-1))) {
      qs = qs.slice(0, qs.length-1)
    }
    return qs
  }
  /**
   * Promise executor with resolve & reject callbacks
   * Returns the callback for handling the https GET request
   * @param {Function} resolve, reject - from Promise
   */
  requestExecutor(requestURL, resolve, reject) {
    return https.get(requestURL, callback)
    function callback(res) {
      const { statusCode } = res
      const contentType = res.headers['content-type']
      let err
      if (statusCode >= 400) {
        err = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
      } else if (!/^application\/json/.test(contentType)) {
        err = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`)
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
}
