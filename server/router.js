import { UserController } from './controllers/userController.js'
import { JSONView } from './views/jsonView.js'

export function router(req, res, next) {
  // const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
  const parsedUrl = new URL(req.url, `http://localhost`)
  const pathname = 
    parsedUrl.pathname.endsWith('/') 
    ? parsedUrl.pathname.slice(0, -1)
    : parsedUrl.pathname
  const params = parsedUrl.searchParams
  const method = req.method
  const idProvided = params.get('id')

  console.log('routing...', pathname)
  if (pathname === '/api/users') {
    if (method === 'GET') {
      return idProvided
      ?  UserController.read(req, res, idProvided)
      :  UserController.readAll(req, res) 
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
      ? UserController.delete(req, res, idProvided)
      : JSONView.renderError(res, 400, `ID needed for method ${method}`)
    }
    console.warn(`Method \"${method}\" not allowed on ${req.url}`)
    return JSONView.renderError(
      res, 405, 
      `Method \"${method}\" not allowed on ${req.url}`,
      ['GET', 'POST', 'PUT', 'DELETE']
      )
  }
  next()
}