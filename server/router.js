import { UserController } from './controllers/userController.js'
import { JSONView } from './views/jsonView.js'

export function router(req, res, next) {
  const url = req.url
  const method = req.method
  const idProvided = url.match(/\/api\/users\/([\w]+)/)

  console.log('routing...')
  if (url === '/api/users') {
    if (method === 'GET') {
      return idProvided
      ?  UserController.readAll(req, res, idProvided[1]) //[1] is regex uuid capture group
      :  UserController.read(req, res) 
    }
    if (method === 'POST') {
      return idProvided
      ? UserController.create(req, res, idProvided[1])
      : UserController.create(req, res)
    }
    if (method === 'PUT') {
      return idProvided
      ? UserController.update(req, res, idProvided[1])
      : UserController.update(req, res)
    }
    if (method === 'DELETE') {
      return idProvided
      ? UserController.delete()
      : JSONView.renderError(res, 400, `ID needed for method ${method}`)
    }
    console.warn(`Method \"${method}\" not allowed on ${url}`)
    return JSONView.renderError(
      res, 405, 
      `Method \"${method}\" not allowed on ${url}`,
      ['GET', 'POST', 'PUT', 'DELETE']
      )
  }
  next()
}