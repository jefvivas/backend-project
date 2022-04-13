import { Response } from 'express'
import { badRequest, okRequest } from '../responses/HttpResponse'
import { userModel } from '../database/model'
// import bcrypt from 'bcrypt'
import { IHttpRequest } from '../responses/HttpRequest'
import { Bcryptadapter } from '../adapters/bcryptAdapter'
import { AddDbAdapter } from '../adapters/addDbAdapter'

interface IRegisterBody{
    login:string,
    name:string,
    password:string,
    passwordConfirmation:string
}
export class RegisterService {
  async register (req:IHttpRequest<IRegisterBody>, res:Response) {
    const requiredfields:Array<keyof IRegisterBody> = ['name', 'login', 'password', 'passwordConfirmation']

    for (const field of requiredfields) {
      if (!req.body[field]) {
        return res.send(badRequest(`Campo ${field} não enviado para criação de conta`))
      }
    }

    const { login, name, password, passwordConfirmation } = req.body

    const loginExists = await userModel.findOne({ login: login })

    if (loginExists === null) {
      if (password === passwordConfirmation) {
        const addUserAdapter = new AddDbAdapter(new Bcryptadapter(12))
        await addUserAdapter.addUser({
          login: login,
          name: name,
          password: password
        })
      } else {
        return res.send(badRequest('Senhas não são iguais'))
      }

      return res.send(okRequest('Usuário criado com sucesso'))
    }
    return res.send(badRequest('Este usuário já existe'))
  }
}
