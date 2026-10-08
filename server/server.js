import http from 'node:http'
import { router } from './router.js'
import { JSONView } from './views/jsonView.js'

const PORT = process.env.PORT || 3500

const middlewares = [
  //url normalizer
  (req, res, next) => {
    if (req.url.endsWith('/') && req.url.length > 1) {
      res.writeHead(302, { 'Location': req.url.slice(0, -1) })
      return res.end()
    }
    next()
  },
  //logger
  (req, res, next) => {
    console.log(`${new Date().toISOString()}\t${req.method}\t${req.url}`)
    next()
  },
  router,
]

const server = http.createServer(async (req, res) => {
  let index = 0

  //scoped in createServer to isolate execution state per request
  async function next() {
    if (index >= middlewares.length)
      return JSONView.renderError(res, 404, 'Resource Not Found')

    const currentMiddleware = middlewares[index++]
    try {
      await currentMiddleware(req, res, next)
    }
    catch(err) {
      console.error(`Server error: ${err}`)
      return JSONView.renderError(res, 500, 'Server error')
    }
  }
  next()
})

server.listen(PORT, () => { console.log(`listening on port ${PORT}`) })