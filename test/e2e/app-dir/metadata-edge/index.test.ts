import { createNextDescribe } from 'e2e-utils'
import imageSize from 'image-size'

createNextDescribe(
  'app dir - Metadata API on the Edge runtime',
  {
    files: __dirname,
  },
  ({ next, isNextStart }) => {
    describe('OG image route', () => {
      if (isNextStart) {
        it('should not bundle `ImageResponse` into the page worker', async () => {
          const pageBundle = await next.readFile(
            '.next/server/middleware-manifest.json'
          )
          expect(pageBundle).not.toContain('ImageResponse')
          expect(pageBundle).not.toContain('NextImageResponse')
        })

        it('should not contain ImageResponse in the edge page bundle', async () => {
          const pageBundle = await next.readFile(
            '.next/server/app/edge-og/page.js'
          )
          expect(pageBundle).not.toContain('ImageResponse')
          expect(pageBundle).not.toContain('NextImageResponse')
        })
      }
    })

    it('should render OpenGraph image meta tag correctly', async () => {
      const $ = await next.render$('/')
      const ogUrl = new URL($('meta[property="og:image"]').attr('content'))
      const imageBuffer = await (await next.fetch(ogUrl.pathname)).buffer()

      const size = imageSize(imageBuffer)
      expect([size.width, size.height]).toEqual([1200, 630])
    })

    it('should render child edge routes OpenGraph image meta tag correctly', async () => {
      const $ = await next.render$('/edge-og')
      expect($('meta[property="og:image:alt"]').attr('content')).toBe(
        'Open Graph Edge'
      )
    })
  }
)
