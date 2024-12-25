import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('env', env);
  return {
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        }
      ]
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL,
          changeOrigin: true
        },
        '/ollama/api': {
          target: env.VITE_MODLE_URL,
          changeOrigin: true
        }
      }
    },
    esbuild: {
      drop:
        process.env.NODE_ENV === 'development' ? [] : ['console', 'debugger']
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          dir: 'dist-gui',
          entryFileNames: `assets/index.js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    }
  };
});
