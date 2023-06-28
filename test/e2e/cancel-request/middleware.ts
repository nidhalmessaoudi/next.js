import { Streamable } from './streamable'

export const config = {
  matcher: '/middleware',
}

const streamable = Streamable()
let aborted = false

export default function handler(req: Request): Response {
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
