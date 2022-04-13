import { userModel } from '../database/model'
import { IEncrypter } from './bcryptAdapter'

export interface IUserModel{
    login:string
    name:string
    password:string
}

export interface IAddDbAdapter{
    addUser(user:IUserModel):Promise<IUserModel>

}

export class AddDbAdapter implements IAddDbAdapter {
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
