import { userModel } from '../database/model'
import { IEncrypter } from './bcryptAdapter'

export interface IUserModel{
    login:string
    name:string
    password:string
}

export interface IUserDbModel{
    _id:string
    login:string
    name:string
    password:string

}

export interface IAddDbAdapter{
    addUser(user:IUserModel):Promise<IUserDbModel>

}

export class AddDbAdapter {
    private readonly encrypter
    constructor (encrypter:IEncrypter) {
      this.encrypter = encrypter
    }

    async addUser (user:IUserModel):Promise<IUserModel> {
      const hashedPassword = await this.encrypter.encrypt(user.password)
      const createdUser = await userModel.create(Object.assign({}, user, { password: hashedPassword }))
      return createdUser
    }
}
