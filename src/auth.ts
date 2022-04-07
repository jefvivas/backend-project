import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const verifyToken = async (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers.authorization
  if (!token) {
    return res.send({ message: 'A token is required for authentication' })
  }
  try {
    jwt.verify(token.split('Bearer ')[1], 'projectJwtKey')
  } catch (err) {
    return res.send({ message: 'Invalid Token' })
  }
  return next()
}
