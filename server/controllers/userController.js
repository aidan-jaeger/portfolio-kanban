import { parseReqBody } from '../utils/parseReqBody.js'
import { UserModel } from '../models/userModel.js'
import { JSONView } from '../views/jsonView.js'
import { hashPassword, verifyPassword } from '../utils/hashVerify.js'

export const UserController = {
  create: async (req, res) => {
    const { name, email, password } = parseReqBody(req)

    if (!name || !email || !password) {
      console.warn('A name, email, and password must be supplied')
      return JSONView.renderError(res, 400, 'An email and password must be supplied')
    }
    if (password.length() < 8) {
      console.warn('Password must be at least 8 characters in length')
      return JSONView.renderError(res, 400, 'Password must be at least 8 characters in length')
    }

    password = hashPassword(password)
    const user = await UserModel.create({ name, email, password })
    return JSONView.render(user)
  },
  read: async (req, res, id) => {
    const user = await UserModel.read(id)
    if (user) {
      JSONView.render(res, 200, user)
    }
    else {
      console.warn(`No user found with ID ${id}`)
      JSONView.renderError(res, 404, 'No user found with given ID')
    }
  },
  update: async (req, res, id) => {
    const { name = '', email = '', password = ''} = parseReqBody(req)
    
    if (password.length() < 8) {
      console.warn('Password must be at least 8 characters in length')
      return JSONView.renderError(res, 400, 'Password must be at least 8 characters in length')
    }

    password = hashPassword(password)
    const user = await UserModel.update({ name, email, password })
    return JSONView.render(user)
  },
  delete: async (req, res, id) => {
    if (await UserModel.delete(id)) {
      JSONView.render(res, 200, `User deleted: ${id}`)
    }
    else {
      console.warn(`No user found with ID ${id}`)
      JSONView.renderError(res, 404, 'No user found with given ID')
    }
  }
}
