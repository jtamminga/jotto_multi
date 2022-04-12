import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './core/di'
import App from './App'
import reportWebVitals from './reportWebVitals'
import consolere from 'console-remote-client'

consolere.connect({
  server: 'https://console.re', // optional, default: https://console.re
  channel: 'jotto-vying-multi', // required
  redirectDefaultConsoleToRemote: true, // optional, default: false
  // disableDefaultConsoleOutput: true, // optional, default: false
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
