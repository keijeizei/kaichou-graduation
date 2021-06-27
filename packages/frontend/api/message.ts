import { MessageInterface } from '../interfaces/message'
import https from 'https'

export async function createMessage(data: MessageInterface) {
  const options = {
    method: 'POST',
    hostname: process.env.API_HOSTNAME ?? 'localhost',
    port: process.env.API_PORT ?? 5000,
    path: '/public/v1/create/message',
    headers: {
      'Content-Type': 'application/json',
    },
    agent: new https.Agent({
      requestCert: true,
      rejectUnauthorized: false,
    }),
  }

  return new Promise((resolve, reject) => {
    const req = https
      .request(options, (res) => {
        res.resume()
      })
      .on('response', (res) => {
        if (res.statusCode == 429) {
          reject(new Error('Submission limit reached. Try again in an hour.'))
        }
        resolve(undefined)
      })

    const body = JSON.stringify(data)

    req.write(body)

    req.end()
  })
}
