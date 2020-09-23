import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

if (window.PRE_RENDERED) {
  ReactDOM.hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
