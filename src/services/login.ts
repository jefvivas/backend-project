import { Response } from 'express'
import { badRequest, okTokenRequest } from '../responses/HttpResponse'
import { sign } from 'jsonwebtoken'
import { userModel } from '../database/model'
import { IHttpRequest } from '../responses/HttpRequest'
import { Bcryptadapter } from '../adapters/bcryptAdapter'

interface ILoginBody{
    login:string
    password:string
}

export class LoginService {
  async login (req:IHttpRequest<ILoginBody>, res:Response) {
    const requiredfields:Array<keyof ILoginBody> = ['login', 'password']

    for (const field of requiredfields) {
      if (!req.body[field]) {
        return res.send(badRequest(`Campo ${field} não enviado para login`))
      }
    }
    const { login, password } = req.body

    const user = await userModel.findOne({ login: login })
    if (user === null) return res.send(badRequest('Usuário ou senha errados'))

    // const validPassword = await bcrypt.compare(password, user.password)
    const bcryptAdapter = new Bcryptadapter(12)

    const validPassword = await bcryptAdapter.compare(password, user.password)

    console.log(validPassword)

    if (!validPassword) return res.send(badRequest('Usuário ou senha errados'))
    sign({ login }, 'projectJwtKey', { expiresIn: 300 })
    return res.send(okTokenRequest('Você está logado', user.name))
  }
}
