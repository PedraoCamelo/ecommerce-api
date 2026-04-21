import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware.js'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/product.service.js'

export async function index(req: AuthRequest, res: Response) {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export async function show(req: AuthRequest, res: Response) {
  try {
    const product = await getProductById(req.params.id as string)
    res.json(product)
  } catch (err: any) {
    res.status(404).json({ error: err.message })
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const product = await createProduct(req.body)
    res.status(201).json(product)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const product = await updateProduct(req.params.id as string, req.body)
    res.json(product)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}


export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteProduct(req.params.id as string)
    res.status(204).send()
  } catch (err: any) {
    res.status(404).json({ error: err.message })
  }
}