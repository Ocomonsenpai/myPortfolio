import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), ],
    build: {
        // Three.js alone often exceeds 500 kB minified; split vendors + relax warning
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return
                    if (id.includes('three')) return 'three'
                    if (id.includes('gsap')) return 'gsap'
                    if (id.includes('motion')) return 'motion'
                    if (
                        id.includes('react-dom') ||
                        id.includes('react-router') ||
                        /[/\\]react[/\\]/.test(id)
                    ) {
                        return 'react-vendor'
                    }
                },
            },
        },
    },
})