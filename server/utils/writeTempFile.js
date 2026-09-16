import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

export async function writeTempFile(data, attempt = 1) {
  if (attempt > 3) throw new Error('Max retries exceeded @ writeTempFile')

  const uniqueName = crypto.randomBytes(16).toString('hex')
  const tempFilePath = path.join(os.tmpdir(), `kanban-${uniqueName}.json`)

  try {
    await fs.writeFile(tempFilePath, data, { flag: 'wx', mode: 0o600 })
    console.log(`Wrote to temp file: ${tempFilePath}`)
    
    return tempFilePath //make sure to clean up tmp file after use w/ fs.rm(isolatedDir, { recursive: true, force: true })
  } 
  catch(err) {
    if (err.code === 'EEXIST') {
      console.warn('File collision detected, retrying with new name')
      return await writeTempFile(data, attempt + 1)
    }
    throw err
  } 
}