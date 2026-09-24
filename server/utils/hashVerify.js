import argon2 from 'argon2'

export async function hashPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MiB
    timeCost: 3,       // Iterations
    parallelism: 4     // Threads
  });
}

export async function verifyPassword(hash, password) {
  return await argon2.verify(hash, password)
}