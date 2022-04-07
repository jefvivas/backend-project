import { Request } from 'express'

export interface IHttpRequest<T> extends Request{
    body: T
}
