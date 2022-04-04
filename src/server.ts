import express, { Response, Request } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bcrypt from 'bcrypt'
import { userModel } from './database/model'
import { sign } from 'jsonwebtoken'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/xu').then(() => console.log('foi o mongodb'))

app.post('/register', async (req:Request, res:Response) => {
  const { login, name, password, passwordConfirmation } = req.body

  const loginExists = await userModel.findOne({ login: login })

  if (loginExists === null) {
    if (password === passwordConfirmation) {
      const hashedPassword = await bcrypt.hash(password, 12)
      await userModel.create({
        login: login,
        name: name,
        password: hashedPassword
      })
    } else {
      return res.send({ message: 'Senhas não são iguais' })
    }

    return res.send({ message: 'Usuario criado com sucesso' })
  }
  return res.send({ message: 'Usuario ja existe' })
})

app.post('/login', async (req:Request, res:Response) => {
  const { login, password } = req.body

  const user = await userModel.findOne({ login: login })
  if (user === null) return res.send({ message: 'Usuario nao existente' })

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) return res.send({ message: 'invalid login or password' })
  const token = sign({ login }, 'xuxuzin', { expiresIn: 300 })
  return res.send({ message: 'logado', token })
})

app.listen(4001, () => console.log('foi servidor'))
