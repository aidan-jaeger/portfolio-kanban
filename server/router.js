import { UserController } from './controllers/userController.js'
import { JSONView } from './views/jsonView.js'

export function router(req, res, next) {
  const url = req.url
  const method = req.method
  const idProvided = url.split('/').pop()

  console.log('routing...', idProvided)
  if (url === '/api/users') {
    if (method === 'GET') {
      return idProvided
      ?  UserController.readAll(req, res, idProvided)
      :  UserController.read(req, res) 
    }
    if (method === 'POST') {
      return idProvided
      ? UserController.create(req, res, idProvided)
      : UserController.create(req, res)
    }
    if (method === 'PUT') {
      return idProvided
      ? UserController.update(req, res, idProvided)
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