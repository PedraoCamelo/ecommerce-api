import { Router } from 'express'
import { index, show, create, update, remove } from '../controllers/product.controller.js'
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', index)
router.get('/:id', show)
router.post('/', authenticate, requireAdmin, create)
router.put('/:id', authenticate, requireAdmin, update)
router.delete('/:id', authenticate, requireAdmin, remove)

export default router