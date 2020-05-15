const { createProxyMiddleware } = require('http-proxy-middleware')
const Bundler = require('parcel')
const express = require('express')

let bundler = new Bundler('src/index.html')
let app = express()

app.use(
  '/.netlify/functions/',
  createProxyMiddleware({
    target: 'http://localhost:9000/',

    changeOrigin: true,
  }),
)

app.use(bundler.middleware())

app.listen(Number(process.env.PORT || 3000))
