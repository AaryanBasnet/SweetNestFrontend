/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
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
