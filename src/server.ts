import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './routes'

const app = express()
app.use(express.json())
app.use(cors())
app.use(router)
mongoose.connect('mongodb://localhost:27017/xu').then(() => console.log('foi o mongodb'))
app.listen(4001, () => console.log('foi servidor'))
