import express, { Response, Request } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { userModel } from './database/model'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/xu').then(() => console.log('foi o mongodb'))

app.post('/register', async (req:Request, res:Response) => {
  const { login, name, password, passwordConfirmation } = req.body

  const loginExists = await userModel.findOne({ login: login })

  if (loginExists === null) {
    if (password === passwordConfirmation) {
      await userModel.create({
        login: login,
        name: name,
        password: password
      })
    } else {
      return res.send({ message: 'Senhas não são iguais' })
    }

    return res.send({ message: 'Usuario criado com sucesso' })
  }
  return res.send({ message: 'Usuario ja existe' })
})

app.listen(4001, () => console.log('foi servidor'))
