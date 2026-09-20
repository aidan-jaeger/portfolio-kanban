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
    atomicWriteJSON(currentData)
    console.log(`Created new user`)
  },
  read: async (id) => {
    const currentData = await getUsersJSON()
    const targetUser = currentData.find(user => user.id === id)
    if (targetUser) {
      console.log(`Read user by id: ${id}`)
      return targetUser
    }
    else {
      throw new Error('A user does not exist with the specified ID')
    }
  },
  update: async (id, data) => {
    const currentData = await getUsersJSON()
    const userIndex = currentData.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      const oldData = currentData[userIndex]
      currentData[userIndex] = { id: id, ...oldData, ...data}
      atomicWriteJSON(currentData)
      console.log(`Updated user by id: ${id}`)
    }
    else {
      throw new Error('A user does not exist with the specified ID')
    }
  },
  delete: async (id) => {
    const currentData = await getUsersJSON()
    const userIndex = currentData.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      currentData.splice(userIndex, 1)
      atomicWriteJSON(currentData)
      console.log(`Deleted user by id: ${id}`)
    }
    else {
      throw new Error('A user does not exist with the specified ID')
    }
  },
}
//TODO rewrite id requesting functions to take JWT auth?
UserModel.delete('3a1c5137-40d3-40ae-9b0c-60856496747d')