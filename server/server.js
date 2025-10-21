import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import fs from 'fs'
import dotenv from 'dotenv'
import router from './routes/cars.js'

// import the router from your routes file


dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
// dev-friendly Content Security Policy to allow local devtools/connects
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; connect-src 'self' http://localhost:3000 ws://localhost:3000; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
        )
        next()
    })
}

// mount API routes under /api/cars so they match the client-side fetch path
app.use('/api/cars', router)

// dev-only: allow same-origin and local dev servers to connect
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "connect-src 'self' http://localhost:3000 http://localhost:3001 http://localhost:5173 ws://localhost:3000 ws://localhost:3001 ws://localhost:5173; " +
      "img-src 'self' data:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline';"
    )
    next()
  })
}
else if (process.env.NODE_ENV === 'production') {
    const favPath = path.resolve('public', 'lightning.png')
    if (fs.existsSync(favPath)) {
        app.use(favicon(favPath))
    } else {
        console.warn('favicon not found at', favPath)
    }
    app.use(express.static('public'))
}

// specify the api path for the server to use


if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})