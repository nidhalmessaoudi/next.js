import { Streamable } from '../../streamable'

export const runtime = 'edge'

const streamable = Streamable()
let aborted = false

export function GET(req: Request): Response {
  const params = new URL(req.url).searchParams
  if (params.has('debug')) {
    return new Response(
      JSON.stringify({
        aborted,
        i: streamable.i,
        canceled: streamable.canceled,
      })
    )
  }

  req.signal.onabort = () => {
    aborted = true
  }
  return new Response(streamable.stream)
}
