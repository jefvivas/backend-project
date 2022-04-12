import bcrypt from 'bcrypt'

export interface IEncrypter{
    encrypt(data:string):Promise<string>
}

export class Bcryptadapter implements IEncrypter {
    private readonly salt:number
    constructor (salt:number) {
      this.salt = salt
    }

    async encrypt (data:string):Promise<string> {
      const hashed = await bcrypt.hash(data, this.salt)
      return hashed
    }
}
