import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import path from 'node:path'
import writeTempFile from '../utils/writeTempFile.js'

const targetFilePath = path.join(import.meta.dirname, '../data/users.json')
const targetDirPath = path.dirname(targetFilePath)

async function getUsersJSON() {
  let parsedData
  try {
    const rawData = await fs.readFile(targetFilePath, 'utf8')
    parsedData = JSON.parse(rawData)
  } 
  catch(err) {
    if (err.code !== 'ENOENT') throw err
  }
  if (!Array.isArray(parsedData)) {
    throw new Error('Target file structure is invalid, data must be a JSON Array');
  }
  return parsedData
}
async function atomicWriteJSON(data) {
  const payload = JSON.stringify(data, null, 2)
  const tempFilePath = await writeTempFile(targetDirPath, payload)

  try {
    await fs.rename(tempFilePath, targetFilePath)
  }
  catch (err) {
    await fs.rm(tempFilePath, { force: true })
    throw err;
  }
}

export const UserModel = {
  create: async (data) => {
    //assemble the data in memory
    const newUser = { id: crypto.randomUUID(), ...data }
    const currentData = await getUsersJSON()
    
    currentData.push(newUser)
    await atomicWriteJSON(currentData)
    return newUser
  },
  read: async (id) => {
    const currentData = await getUsersJSON()
    return currentData.find(user => user.id === id) || null
  },
  update: async (id, data) => {
    const currentData = await getUsersJSON()
    const userIndex = currentData.findIndex(user => user.id === id)
    if (userIndex !== -1) return null
    
    const oldData = currentData[userIndex]
    const newData = { ...oldData, ...data, id: id }
    currentData[userIndex] = newData

    await atomicWriteJSON(currentData)
    return true
  },
  delete: async (id) => {
    const currentData = await getUsersJSON()
    const userIndex = currentData.findIndex(user => user.id === id)
    if (userIndex !== -1) return null
    
    currentData.splice(userIndex, 1)
    await atomicWriteJSON(currentData)
    return true
  },
}