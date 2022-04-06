import express, { Response, Request } from 'express'
import { userModel } from './database/model'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { verifyToken } from './auth'

const router = express.Router()

router.post('/register', async (req:Request, res:Response) => {
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

router.post('/login', async (req:Request, res:Response) => {
  const { login, password } = req.body

  const user = await userModel.findOne({ login: login })
  if (user === null) return res.send({ message: 'Usuario nao existente' })

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) return res.send({ message: 'invalid login or password' })
  const token = sign({ login }, 'projectJwtKey', { expiresIn: 300 })
  return res.send({ message: 'logado', token })
})

router.get('/auth', verifyToken, (req:Request, res:Response) => {
  res.send({ message: 'oi' })
})

export default router
