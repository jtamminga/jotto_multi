import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './core/di'
import { gameFlow } from './core/di'
import App from './App'
import { onLobbyRedirect } from './core/url'

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