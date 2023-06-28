import { IncomingMessage, ServerResponse } from 'http'
import { pipeline } from 'stream'
import { Readable } from '../../readable'

export const runtime = 'nodejs'

const readable = Readable()
let aborted = false

export function GET(req: IncomingMessage, res: ServerResponse): void {
  const params = new URL(req.url!, 'http://localhost/').searchParams
  if (params.has('debug')) {
    res.end(
      JSON.stringify({
        aborted,
        i: readable.i,
        destroyed: readable.destroyed,
      })
    )
    return
  }

  req.on('error', () => {
    aborted = true
  })
  pipeline(readable.stream, res, () => {
    res.end()
  })
}
