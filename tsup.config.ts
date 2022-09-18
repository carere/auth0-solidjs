import { solidPlugin } from 'esbuild-plugin-solid'
import { defineConfig } from 'tsup'
import pkg from './package.json'

export default defineConfig({
  name: 'auth0-solidjs',
  platform: 'browser',
  entry: ['src/index.tsx'],
  treeshake: true,
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  env: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    VERSION: pkg.version,
  },
  esbuildPlugins: [solidPlugin()],
})
