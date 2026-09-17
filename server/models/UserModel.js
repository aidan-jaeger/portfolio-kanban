import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import path from 'node:path'
import writeTempFile from '../utils/writeTempFile.js'

const targetFilePath = path.join(import.meta.dirname, '../data/users.json')
const targetDirPath = path.dirname(targetFilePath)

export const UserModel = {
  create: async (data) => {
    //assemble the data in memory
    const newUser = { id: crypto.randomUUID(), ...data }
    let currentData = []
    try {
      const rawData = await fs.readFile(targetFilePath, 'utf8')
      currentData = JSON.parse(rawData)
    } 
    catch(err) {
      if (err.code !== 'ENOENT') throw err
      fs.mkdir(targetDirPath)
    }
    if (!Array.isArray(currentData)) {
      throw new Error('Target file structure is invalid, data must be a JSON Array');
    }
    currentData.push(newUser)

    //set up temp file for atomic write
    const payload = JSON.stringify(currentData, null, 2)
    const tempFilePath = await writeTempFile(targetDirPath, payload)

    try {
      await fs.rename(tempFilePath, targetFilePath)
      return { success: true }
    }
    catch (err) {
      await fs.rm(tempFilePath, { force: true })
      throw err;
    }
  },
  read: async (id) => {
    
  },
  update: async (id, data) => {
    
  },
  delete: async (id) => {

  },
}