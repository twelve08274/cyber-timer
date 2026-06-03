import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WidgetView } from './components/Widget/WidgetView.tsx'

const isWidget = new URLSearchParams(window.location.search).has('widget')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isWidget ? <WidgetView /> : <App />}
  </StrictMode>,
)
