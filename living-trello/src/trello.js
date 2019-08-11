import https from 'https'
import qs from 'qs'
const {TRELLO_OAUTH_TOKEN, TRELLO_API_KEY, TRELLO_BOARD_ID} = process.env

export default class Trello {

  constructor(key, token) {
    this.key = key
    this.token = token
    this.urlFrom = this.urlFrom.bind(this)
  }

  /**
   * @param {String || Object} input
   * If first arg type String then it performs a GET request to that path under Trello API
   * If first arg type Object
   *  @property {String} path - Endpoint path for Trello API
   *  @property {String} method - 'GET', 'POST' etc.
   *  @property {Object} body - optional JSON payload
   *  @property {Object} qs - querystring object
   */
  call(input) {
    const { path = '', method = 'GET', body = null, qs = {} } = input
    const url = this.urlFrom(path || input, qs)
    return new Promise(
      this.requestExecutor.bind(
        null, 
        {
          url, 
          method, 
          body
        }
      )
    ).catch(console.error)
  }

  /**
   * Parses the query string to ensure that excess chars are removed before passing it back to Trello.call
   * @param {String} path - the endpoint string without hostname, e.g. "/boards"
   */
  urlFrom(path, query) {
    if (!path) throw new Error('Path must be a valid string.')
    if (path.includes('?')) throw new Error('Use "qs" param to handle queries, not the path.')
    return (
      `https://api.trello.com/1/${path}?${
        qs.stringify({
          ...query,
          key: this.key,
          token: this.token,
          card_limit: 1000
        })
      }`
    )
  }

  /**
   * Bind the options to return a Promise executor with resolve & reject callbacks for any HTTP method.
   * @param {Object} options - HTTPS request options
   *   @property {String} url - full string url for the request
   *   @property {String} method - HTTP method, e.g. GET, POST
   *   @property {Object} body - if any, include the JSON payload
   * @param {Function} resolve, reject - from Promise
   */
  requestExecutor({url, method, body}, resolve, reject) {
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
    const request = https.request(
      url,
      {
        method
      },
      callback
    )
    if (body) request.write(JSON.stringify(body))
    request.end()
  }
}
