export function router(req, res, next) {
  if (req.url === '/users') {
    if (req.method === 'GET')
      return
    if (req.method === 'POST')
      return
    if (req.method === 'PUT')
      return
    if (req.method === 'DELETE')
      return
  }
  
  next()
}