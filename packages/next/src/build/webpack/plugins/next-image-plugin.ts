import { webpack } from 'next/dist/compiled/webpack/webpack'
import fs from 'fs'
import { dirname, join } from 'path'
export class NextImagePlugin {
  loaderFile: string
  constructor({ loaderFile }: { loaderFile: string }) {
    this.loaderFile = loaderFile
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.beforeCompile.tap('NextImagePlugin', () => {
      const source = fs.readFileSync(this.loaderFile, 'utf8')
      const code = source.replace(/export default/, 'exports.default =')

      fs.writeFileSync(
        join(
          dirname(require.resolve('next/dist/shared/lib/image-loader')),
          'custom-image-loader.js'
        ),
        code
      )
    })
  }
}
