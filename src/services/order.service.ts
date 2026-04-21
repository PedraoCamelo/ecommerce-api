import { prisma } from '../lib/prisma.js'

export async function createOrder(userId: string, items: { productId: string, quantity: number }[]) {
  // busca todos os produtos de uma vez
  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } }
  })

  if (products.length !== items.length) {
    throw new Error('Um ou mais produtos não encontrados')
  }

  // verifica estoque e calcula total
  for (const item of items) {
    const product = products.find(p => p.id === item.productId)!
    if (product.stock < item.quantity) {
      throw new Error(`Estoque insuficiente para o produto: ${product.name}`)
    }
  }

  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId)!
    return sum + product.price * item.quantity
  }, 0)

  // cria pedido, itens e desconta estoque numa transação
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        total,
        items: {
          create: items.map(item => {
            const product = products.find(p => p.id === item.productId)!
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price
            }
          })
        }
      },
      include: { items: true }
    })

    // desconta estoque de cada produto
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    return order
  })
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getOrderById(orderId: string, userId: string, userRole: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  if (!order) throw new Error('Pedido não encontrado')

  // customer só pode ver o próprio pedido
  if (userRole !== 'ADMIN' && order.userId !== userId) {
    throw new Error('Acesso negado')
  }

  return order
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } })
  if (!order) throw new Error('Pedido não encontrado')

  return prisma.order.update({
    where: { id: orderId },
    data: { status: status as any }
  })
}