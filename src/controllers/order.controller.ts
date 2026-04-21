import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware.js'
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} from '../services/order.service.js'

export async function create(req: AuthRequest, res: Response) {
  try {
    const order = await createOrder(req.userId!, req.body.items)
    res.status(201).json(order)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function myOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await getUserOrders(req.userId!)
    res.json(orders)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function show(req: AuthRequest, res: Response) {
  try {
    const order = await getOrderById(req.params.id as string, req.userId!, req.userRole!)
    res.json(order)
  } catch (err: any) {
    const status = err.message === 'Acesso negado' ? 403 : 404
    res.status(status).json({ error: err.message })
  }
}

export async function updateStatus(req: AuthRequest, res: Response) {
  try {
    const order = await updateOrderStatus(req.params.id as string, req.body.status)
    res.json(order)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}