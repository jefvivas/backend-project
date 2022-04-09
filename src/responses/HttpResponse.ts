
export interface IHttpResponse{
  statusCode:number,
  body:any
}

export const badRequest = (error:string):IHttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const okRequest = (okMessage:string):IHttpResponse => {
  return {
    statusCode: 200,
    body: okMessage
  }
}

export const okTokenRequest = (okTokenMessage:string, name:string):IHttpResponse => {
  return {
    statusCode: 200,
    body: {
      okTokenMessage,
      name
    }
  }
}
