function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export function Streamable() {
  const encoder = new TextEncoder()
  const streamable = {
    i: 0,
    canceled: undefined as Error | true | undefined,
    stream: new ReadableStream({
      async pull(controller) {
        await sleep(100)
        controller.enqueue(encoder.encode(String(streamable.i++)))

        if (streamable.i >= 25) controller.close()
      },
      cancel(e) {
        streamable.canceled = e ?? true
      },
    }),
  }
  return streamable
}
