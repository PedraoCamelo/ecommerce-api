import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email já cadastrado')

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  })

  return { id: user.id, name: user.name, email: user.email }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Credenciais inválidas')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new Error('Credenciais inválidas')

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  return { token, user: { id: user.id, name: user.name, role: user.role } }
}