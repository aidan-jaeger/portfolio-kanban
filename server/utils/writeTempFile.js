import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

export async function writeTempFile(data) {
  const uniqueName = crypto.randomBytes(16).toString('hex')
  const tempPath = await fs.mkdtemp(path.join(os.tmpdir(), `kanban-${uniqueName}.tmp`))

  try {
    await fs.writeFile(tempPath, data, { flag: 'wx', mode: 0o600 })
    console.log(`Wrote to temp file: ${tempPath}`)
    
    return tempPath //make sure to clean up tmp file after use w/ fs.rm(isolatedDir, { recursive: true, force: true })
  } 
  catch {
    if (err.code === 'EEXIST') {
      console.warn('File collision detected, retrying with new name')
      return await writeTempFile(data)
    }
    throw err
  } 
}