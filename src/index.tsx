import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './core/di'
import { config, gameFlow } from './core/di'
import App from './App'
import LogRocket from 'logrocket'
import { onLobbyRedirect } from './core/url'

// start log rocket if in production
if (process.env.NODE_ENV === 'production') {
  LogRocket.init(config.logRocketAppId)
}

// redirect to lobby if there is a join url
onLobbyRedirect(code => {
  console.log(`[index] connecting to lobby ${code}`)
  gameFlow.joiningLobby()
  gameFlow.joinLobby(code)
})

// render
const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)