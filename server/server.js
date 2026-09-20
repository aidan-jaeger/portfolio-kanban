import http from 'node:http'
import router from './router.js'
import JsonView from './views/jsonView.js'

const PORT = process.env.PORT || 3500

const middlewares = [
  //logger
  (req, res, next) => {
    console.log(`${new Date().toISOString()}\t${req.method}\t${req.url}`)
    next()
  },
  router,
]

const server = http.createServer(async (req, res) => {
  let index = 0

  async function next() {
    if (index >= middlewares.length)
      return JsonView(res, 404, 'Resource Not Found')

    const currentMiddleware = middlewares[index++]
    try {
      await currentMiddleware(req, res, next)
    }
    catch(err) {
      console.error(`Server error: ${err}`)
      //error view here
    }
  }
  next()
})

server.listen(PORT, () => { console.log(`listening on port ${PORT}`) })