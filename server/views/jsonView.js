const JSONView = {
  // Format successful data responses
  render: (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  },

  // Format error payloads uniformly
  renderError: (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: message }))
  }
}