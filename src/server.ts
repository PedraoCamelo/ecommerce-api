import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/products', productRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API ecommerce rodando!' })
})

const PORT = process.env.PORT ?? 3333
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})