import express, { Response, Request } from 'express'
import { userModel } from './database/model'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { verifyToken } from './auth'
import { badRequest, okRequest, okTokenRequest } from './responses/HttpResponse'

const router = express.Router()

router.post('/register', async (req:Request, res:Response) => {
  const requiredfields = ['login', 'name', 'password', 'passwordConfirmation']

  const { login, name, password, passwordConfirmation } = req.body

  for (const field of requiredfields) {
    console.log(req.body[field])
    if (!req.body[field]) {
      return res.send(badRequest(`Campo ${field} não enviado para criação de conta`))
    }
  }

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
      return res.send(badRequest('Senhas não são iguais'))
    }

    return res.send(okRequest('Usuário criado com sucesso'))
  }
  return res.send(badRequest('Este usuário já existe'))
})

router.post('/login', async (req:Request, res:Response) => {
  const requiredfields = ['login', 'password']

  const { login, password } = req.body
  for (const field of requiredfields) {
    if (!req.body[field]) {
      return res.send(badRequest(`Campo ${field} não enviado para login`))
    }
  }

  const user = await userModel.findOne({ login: login })
  if (user === null) return res.send(badRequest('Usuário ou senha errados'))

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) return res.send(badRequest('Usuário ou senha errados'))
  const token = sign({ login }, 'projectJwtKey', { expiresIn: 300 })
  return res.send(okTokenRequest('Você está logado', token))
})

router.get('/auth', verifyToken, (req:Request, res:Response) => {
  res.send(okRequest('Chegou na rota protegida'))
})

export default router
