import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './core/di'
import { config, appFlow } from './core/di'
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
  appFlow.joiningLobby()
  appFlow.joinLobby(code)
})

// render
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
