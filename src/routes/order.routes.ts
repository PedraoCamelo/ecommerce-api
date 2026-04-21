import { Router } from 'express'
import { create, myOrders, show, updateStatus } from '../controllers/order.controller.js'
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authenticate, create)
router.get('/my', authenticate, myOrders)
router.get('/:id', authenticate, show)
router.patch('/:id/status', authenticate, requireAdmin, updateStatus)

export default router