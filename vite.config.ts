import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_')

  const defines = Object.fromEntries(
    Object.entries(env).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)])
  )

  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
      'process.env.PUBLIC_URL': JSON.stringify(''),
      ...defines,
      // Override the CRA $npm_package_* magic with actual package.json values
      'process.env.REACT_APP_VERSION': JSON.stringify(pkg.version),
      'process.env.REACT_APP_SURVEY_ENGINE_VERSION': JSON.stringify(pkg.dependencies['survey-engine']),
      // Catch-all: any process.env.X not explicitly defined evaluates to undefined
      'process.env': '{}',
    },
    resolve: {
      preserveSymlinks: true,
      dedupe: ['react', 'react-dom'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['node_modules'],
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://influweb.staging.influenzanet.info',
          changeOrigin: true,
          secure: false,
        },
        '/dashboard': {
          target: 'https://influweb.staging.influenzanet.info',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
        '/_stcore': {
          target: 'https://influweb.staging.influenzanet.info',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  }
})
