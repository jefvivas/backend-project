import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export const verifyToken = async (req:Request, res:Response, next:NextFunction) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (!token) {
    return res.send({ message: 'A token is required for authentication' })
  }
  try {
    await jwt.verify(token, 'projectJwtKey')
  } catch (err) {
    return res.send({ message: 'Invalid Token' })
  }
  return next()
}
