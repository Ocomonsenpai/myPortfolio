import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Import BrowserRouter
import App from './App'
import './index.css'
import { ASTEROID_GLB_URL, preloadAsteroidGltf } from './asteroidPreload.js'

const preloadLink = document.createElement('link')
preloadLink.rel = 'preload'
preloadLink.href = ASTEROID_GLB_URL
preloadLink.as = 'fetch'
preloadLink.crossOrigin = 'anonymous'
document.head.appendChild(preloadLink)

preloadAsteroidGltf()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Wrap App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

