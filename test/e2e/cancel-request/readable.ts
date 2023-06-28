import * as stream from 'stream'

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export function Readable() {
  const encoder = new TextEncoder()
  const readable = {
    i: 0,
    destroyed: undefined as Error | true | undefined,
    stream: new stream.Readable({
      async read() {
        await sleep(100)
        this.push(encoder.encode(String(readable.i++)))

        if (readable.i >= 25) this.push(null)
      },
      destroy(e) {
        readable.destroyed = e ?? true
      },
    }),
  }
  return readable
}
