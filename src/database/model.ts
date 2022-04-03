import mongoose, { Schema } from 'mongoose'

export interface User {
  login: string;
  name: string;
  password: string;
}

const userSchema = new Schema<User>({
  login: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const userModel = mongoose.model('User', userSchema)

export { userModel }
