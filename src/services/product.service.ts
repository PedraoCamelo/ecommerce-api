import { prisma } from '../lib/prisma.js'

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) throw new Error('Produto não encontrado')
  return product
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
}) {
  return prisma.product.create({ data })
}

export async function updateProduct(id: string, data: {
  name?: string
  description?: string
  price?: number
  stock?: number
  imageUrl?: string
}) {
  const exists = await prisma.product.findUnique({ where: { id } })
  if (!exists) throw new Error('Produto não encontrado')
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string) {
  const exists = await prisma.product.findUnique({ where: { id } })
  if (!exists) throw new Error('Produto não encontrado')
  return prisma.product.delete({ where: { id } })
}