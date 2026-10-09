import { parseReqBody } from '../utils/parseReqBody.js'
import { UserModel } from '../models/userModel.js'
import { JSONView } from '../views/jsonView.js'
import { hashPassword, verifyPassword } from '../utils/hashVerify.js'

export const UserController = {
  create: async (req, res, id) => {
    const reqBody = await parseReqBody(req)
    const { name, email, password } = reqBody

    if (!name || !email || !password) {
      console.warn('A name, email, and password must be supplied')
      return JSONView.renderError(res, 400, 'A name, email, and password must be supplied')
    }
    if (password.length < 8) {
      console.warn('Password must be at least 8 characters in length')
      return JSONView.renderError(res, 400, 'Password must be at least 8 characters in length')
    }

    const hashedPassword = await hashPassword(password)
    const user = await UserModel.create({ name, email, hashedPassword }, id)

    console.log(`result: ${user.result}\nreason: ${user.reason}`)
    
    return user.result
    ? JSONView.render(res, 200, user.result)
    : JSONView.renderError(res, 409, user.result) //email already assigned
  },
  read: async (req, res, id) => {
    const user = await UserModel.read(id)

    console.log(`result: ${user.result}\nreason: ${user.reason}`)

    return user.result
    ? JSONView.render(res, 200, user.result)
    : JSONView.renderError(res, 404, user.result) //no user with id specified
  },
  readAll: async (req, res) => {
    const users = await UserModel.readAll()

    console.log(`result: ${users.result}\nreason: ${users.reason}`)

    return users.result
    ? JSONView.render(res, 200, users.result)
    : JSONView.renderError(res, 404, users.result) //no users in database
  },
  update: async (req, res, id) => {
    const body = parseReqBody(req)
    const updateData = {}
    if (body.name && body.name.trim() !== '') updateData.name = body.name
    if (body.email && body.email.trim() !== '') updateData.email = body.email
    if (body.password && body.password.trim() !== '') updateData.password = body.password
    
    if (password.length() < 8) {
      console.warn('Password must be at least 8 characters in length')
      return JSONView.renderError(res, 400, 'Password must be at least 8 characters in length')
    }

    updateData.password = hashPassword(updateData.password)
    const user = await UserModel.update(updateData, id)

    console.log(`result: ${user.result}\nreason: ${user.reason}`)

    return user.result
    ? JSONView.render(res, 200, user.result)
    : JSONView.renderError(res, 409, user.result) //email conflict
  },
  delete: async (req, res, id) => {
    const deletion = await UserModel.delete(id)
    console.log(`result: ${deletion.result}\nreason: ${deletion.reason}`)

    return deletion.result
    ? JSONView.render(res, 200, deletion.result)
    : JSONView.renderError(res, 404, deletion.result) //no user found with id
  }
}
