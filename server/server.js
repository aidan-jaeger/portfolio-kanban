import http from 'node:http'
import router from './router.js'
import JsonView from './views/jsonView.js'

const PORT = process.env.port || 3500

const middlewares = [
  //logger
  (req, res, next) => {
    console.log(`${new Date().toISOString()}\t${req.method}\t${req.url}`)
    rext()
  },
  router,
]

const server = http.createServer((req, res) => {
  let index = 0

  function next() {
    if (index >= middlewares.length)
      return JsonView(res, 404, 'Resource Not Found')

    const currentMiddleware = middlewares[index++]
    currentMiddleware(req, res, next)
  }
  
  next()
})

server.listen(PORT, () => { console.log(`listening on port ${PORT}`) })