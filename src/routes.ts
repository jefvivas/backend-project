import express, { Response, Request } from 'express'
import { verifyToken } from './auth'
import { okRequest } from './responses/HttpResponse'
import { RegisterService } from './services/register'
import { LoginService } from './services/login'

const router = express.Router()

router.post('/register', new RegisterService().register)

router.post('/login', new LoginService().login)

router.get('/auth', verifyToken, (req:Request, res:Response) => {
  res.send(okRequest('Chegou na rota protegida'))
})

export default router
