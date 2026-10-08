/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    rollupOptions: {
      output: {
        // Split the big libraries out of the app's own code. They change far less
        // often than the app does, so a returning visitor keeps them cached after a
        // deploy, and the browser can fetch them in parallel on a first visit.
        // (The 3D library is left alone: it already loads only on the designer page.)
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules/react-router')) return 'router';
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'motion';
          if (id.includes('node_modules/@tanstack')) return 'query';
          return undefined;
        },
      },
    },
  },

  test: {
    // The Playwright tests in e2e/ run in their own runner (npm run test:e2e)
    exclude: [...configDefaults.exclude, 'e2e/**'],

    // Components need a DOM; the store and api tests do not care either way.
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],

      // Scoped to the logic layer that the suite actually covers: stores,
      // the API client, route guards and utilities. Including every component
      // as well would report ~3% and tell us nothing useful.
      //
      // Component and page coverage is the next step - widen this list as
      // those tests land, rather than leaving a number nobody believes.
      include: [
        'src/stores/**',
        'src/api/**',
        'src/routers/**',
        'src/utils/**',
      ],
      exclude: ['src/test/**', '**/*.test.{js,jsx}'],
    },
  },
})
